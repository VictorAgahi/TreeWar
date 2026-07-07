import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
const request = require('supertest');
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Transaction Module (e2e)', () => {
  let app: INestApplication<App>;
  let aliceToken: string;
  let bobToken: string;
  let charlieToken: string;

  const tree1Id = '00000000-0000-0000-0000-100000000001';
  const tree2Id = '00000000-0000-0000-0000-100000000002';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Clear DB
    const dataSource = app.get(DataSource);
    await dataSource.query('DELETE FROM "transactions"');
    await dataSource.query('DELETE FROM "trees"');
    await dataSource.query('DELETE FROM "users"');

    // Helper to create user
    const createUser = async (name: string) => {
      const email = `${name}-${Date.now()}@example.com`;
      await request(app.getHttpServer())
        .post('/user/register')
        .send({ email, password: 'password123' });
      const login = await request(app.getHttpServer())
        .post('/user/login')
        .send({ email, password: 'password123' });
      return login.body.accessToken;
    };

    aliceToken = await createUser('alice');
    bobToken = await createUser('bob');
    charlieToken = await createUser('charlie');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create transactions when buying trees', async () => {
    // 1. Alice buys Tree 1 for 100
    let res = await request(app.getHttpServer())
      .put('/tree/buy')
      .set('Authorization', `Bearer ${aliceToken}`)
      .send({ treeId: tree1Id, amount: 100, lat: 10, lng: 10 });
    
    expect(res.status).toBe(200);

    // 2. Bob buys Tree 1 (steals it) for 150
    res = await request(app.getHttpServer())
      .put('/tree/buy')
      .set('Authorization', `Bearer ${bobToken}`)
      .send({ treeId: tree1Id, amount: 150, lat: 10, lng: 10 });
    expect(res.status).toBe(200);

    // 3. Alice buys Tree 2 for 200
    res = await request(app.getHttpServer())
      .put('/tree/buy')
      .set('Authorization', `Bearer ${aliceToken}`)
      .send({ treeId: tree2Id, amount: 200, lat: 20, lng: 20 });
    expect(res.status).toBe(200);
  });

  it('should retrieve my transactions (Alice)', async () => {
    const res = await request(app.getHttpServer())
      .get('/transaction/me')
      .set('Authorization', `Bearer ${aliceToken}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    
    // Ordered by createdAt DESC, so most recent is Tree 2 for 200
    expect(res.body[0].itemId).toBe(tree2Id);
    expect(res.body[0].price).toBe(200);
    expect(res.body[0].action).toBe('BUY');
    expect(res.body[0].itemType).toBe('TREE');

    expect(res.body[1].itemId).toBe(tree1Id);
    expect(res.body[1].price).toBe(100);
  });

  it('should retrieve my transactions (Bob)', async () => {
    const res = await request(app.getHttpServer())
      .get('/transaction/me')
      .set('Authorization', `Bearer ${bobToken}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    
    expect(res.body[0].itemId).toBe(tree1Id);
    expect(res.body[0].price).toBe(150);
  });

  it('should retrieve tree specific transactions (Tree 1)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/transaction/tree/${tree1Id}`)
      // No auth needed for this route
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);

    // Ordered by createdAt DESC, so Bob's purchase is first
    expect(res.body[0].price).toBe(150);
    expect(res.body[0].user).toBeDefined();
    
    expect(res.body[1].price).toBe(100);
    expect(res.body[1].user).toBeDefined();
  });

  it('should retrieve tree specific transactions (Tree 2)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/transaction/tree/${tree2Id}`)
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);

    expect(res.body[0].price).toBe(200);
  });
});

describe('Transaction Module (e2e) - Mass Scenario', () => {
  let app: INestApplication<App>;
  const users: { token: string; username: string }[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const dataSource = app.get(DataSource);
    await dataSource.query('DELETE FROM "transactions"');
    await dataSource.query('DELETE FROM "trees"');
    await dataSource.query('DELETE FROM "users"');

    // Create 5 users
    for (let i = 0; i < 5; i++) {
      const email = `trans-mass-${i}-${Date.now()}@example.com`;
      await request(app.getHttpServer()).post('/user/register').send({ email, password: 'password123' });
      const login = await request(app.getHttpServer()).post('/user/login').send({ email, password: 'password123' });
      const me = await request(app.getHttpServer()).get('/user/me').set('Authorization', `Bearer ${login.body.accessToken}`);
      users.push({ token: login.body.accessToken, username: me.body.username });
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('should handle many transactions correctly', async () => {
    // Each user buys 10 trees
    for (let u = 0; u < 5; u++) {
      for (let t = 0; t < 10; t++) {
        const treeUuid = `00000000-0000-0000-0000-2${u.toString().padStart(5, '0')}${t.toString().padStart(6, '0')}`;
        await request(app.getHttpServer())
          .put('/tree/buy')
          .set('Authorization', `Bearer ${users[u].token}`)
          .send({ treeId: treeUuid, amount: 100 + t * 10, lat: 10, lng: 10 });
      }
    }

    // Verify User 0 has 10 transactions
    const res = await request(app.getHttpServer())
      .get('/transaction/me')
      .set('Authorization', `Bearer ${users[0].token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(10);
    
    // Most recent is the 10th tree (amount: 190)
    expect(res.body[0].price).toBe(190);
    expect(res.body[9].price).toBe(100);
  }, 30000); // Higher timeout for 50 requests
});
