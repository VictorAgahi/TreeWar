import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
const request = require('supertest');
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Tree Module (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let treeId: string = '00000000-0000-0000-0000-000000000001';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Clear DB
    const dataSource = app.get(DataSource);
    await dataSource.query('DELETE FROM "trees"');
    await dataSource.query('DELETE FROM "users"');

    // Create a user and login to get token
    const userEmail = `tree-test-${Date.now()}@example.com`;
    await request(app.getHttpServer()).post('/user/register').send({
      email: userEmail,
      password: 'password123',
    });

    const loginRes = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: userEmail,
        password: 'password123',
      });
    accessToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });



  describe('/tree/buy (PUT) - Buy', () => {
    it('should fail to buy tree if not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .put(`/tree/buy`)
        .send({ treeId, amount: 300, lat: 48.8566, lng: 2.3522 });

      expect(response.status).toBe(401);
    });

    it('should fail to buy tree if amount is too low', async () => {
      const uniqueTreeId = '00000000-0000-0000-0000-000000000002';
      await request(app.getHttpServer())
        .put(`/tree/buy`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ treeId: uniqueTreeId, amount: 200, lat: 48.8566, lng: 2.3522 });
        
      const email = `test2-${Date.now()}@example.com`;
      await request(app.getHttpServer()).post('/user/register').send({ email, password: 'password123' });
      const login = await request(app.getHttpServer()).post('/user/login').send({ email, password: 'password123' });
      const token2 = login.body.accessToken;

      const response = await request(app.getHttpServer())
        .put(`/tree/buy`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ treeId: uniqueTreeId, amount: 150, lat: 48.8566, lng: 2.3522 }); // Tree price is 200

      expect(response.status).toBe(400);
    });

    it('should successfully buy tree, deduct credits, and rename it', async () => {
      const uniqueTreeId3 = '00000000-0000-0000-0000-000000000003';
      const response = await request(app.getHttpServer())
        .put(`/tree/buy`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ treeId: uniqueTreeId3, amount: 300, lat: 48.8566, lng: 2.3522, newName: 'Mon Super Arbre' });

      expect(response.status).toBe(200); // OK (NestJS PUT default)
      expect(response.body).toHaveProperty('price', 300);
      expect(response.body).toHaveProperty('ownerId');
      expect(response.body).toHaveProperty('name', 'Mon Super Arbre');

      // Verify credits are deducted
      const meRes = await request(app.getHttpServer())
        .get('/user/me')
        .set('Authorization', `Bearer ${accessToken}`);
      
      expect(meRes.status).toBe(200);
      // user starts with 3000 credits, deducted 200 (previous test) then 300 (this test) -> 2500
      expect(meRes.body.credits).toBe(2500);
    });
  });

  describe('/tree/me (GET) - Get My Trees', () => {
    it('should return the trees owned by the user', async () => {
      const response = await request(app.getHttpServer())
        .get('/tree/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(2); // ID 2 (200 credits) + ID 3 (300 credits)
      // Check that the renamed one is there
      const renamedTree = response.body.find((t: any) => t.id === '00000000-0000-0000-0000-000000000003');
      expect(renamedTree).toHaveProperty('name', 'Mon Super Arbre');
    });

    it('should fail if not authenticated', async () => {
      const response = await request(app.getHttpServer()).get('/tree/me');
      expect(response.status).toBe(401);
    });
  });
});
