import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
const request = require('supertest');
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface LeaderboardUser {
  username: string;
  treeCount?: number;
  totalValue?: number;
  maxTreePrice?: number;
}

describe('User Module (e2e)', () => {
  let app: INestApplication<App>;
  let userEmail: string;
  let accessToken: string;
  const userPassword = 'password123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(new ValidationPipe());
    
    await app.init();
    userEmail = `test-${Date.now()}@example.com`;

    // Clear DB to avoid test data accumulation
    const dataSource = app.get(DataSource);
    await dataSource.query('DELETE FROM "trees"');
    await dataSource.query('DELETE FROM "users"');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/user/register (POST)', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const registerPayload = {
        email: userEmail,
        password: userPassword,
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send(registerPayload);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Utilisateur créé avec succès');
      expect(response.body).toHaveProperty('userId');
      expect(typeof response.body.userId).toBe('string');
    });

    it('should fail to register with an existing email', async () => {
      // Arrange
      const registerPayload = {
        email: userEmail,
        password: userPassword,
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/user/register')
        .send(registerPayload);

      // Assert
      expect(response.status).toBe(409);
    });
  });

  describe('/user/login (POST)', () => {
    it('should login and return an access token', async () => {
      // Arrange
      const loginPayload = {
        email: userEmail,
        password: userPassword,
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send(loginPayload);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(typeof response.body.accessToken).toBe('string');
      accessToken = response.body.accessToken;
    });

    it('should fail to login with wrong password', async () => {
      // Arrange
      const loginPayload = {
        email: userEmail,
        password: 'wrongpassword',
      };

      // Act
      const response = await request(app.getHttpServer())
        .post('/user/login')
        .send(loginPayload);

      // Assert
      expect(response.status).toBe(401);
    });
  });

  describe('/user/me (GET)', () => {
    it('should get current user profile with valid token', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .get('/user/me')
        .set('Authorization', `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', userEmail);
      expect(response.body).toHaveProperty('username');
      expect(response.body.username).toMatch(/^Joueur_.+$/);
      expect(response.body).toHaveProperty('credits', 3000);
    });

    it('should reject if no token provided', async () => {
      // Act
      const response = await request(app.getHttpServer()).get('/user/me');

      // Assert
      expect(response.status).toBe(401);
    });
  });

  describe('/user/username (PATCH)', () => {
    it('should update username with valid payload', async () => {
      // Arrange
      const newUsername = `NewPseudo${Math.random().toString(36).substring(2, 6)}`;
      const updatePayload = {
        username: newUsername,
      };

      // Act
      const response = await request(app.getHttpServer())
        .patch('/user/username')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePayload);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username', newUsername);
    });

    it('should reject invalid username', async () => {
      // Arrange
      const updatePayload = {
        username: 'a', // Trop court
      };

      // Act
      const response = await request(app.getHttpServer())
        .patch('/user/username')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePayload);

      // Assert
      expect(response.status).toBe(400); // Bad Request (ValidationPipe)
    });
  });

  describe('/user/leaderboard (GET)', () => {
    let user1Name: string;
    let user2Name: string;
    let user3Name: string;

    beforeAll(async () => {
      // Create 3 users
      const users = [];
      for (let i = 1; i <= 3; i++) {
        const email = `lb-test-${i}-${Date.now()}@example.com`;
        await request(app.getHttpServer()).post('/user/register').send({ email, password: 'password123' });
        const login = await request(app.getHttpServer()).post('/user/login').send({ email, password: 'password123' });
        const me = await request(app.getHttpServer()).get('/user/me').set('Authorization', `Bearer ${login.body.accessToken}`);
        users.push({ token: login.body.accessToken, username: me.body.username });
      }
      const user1Token = users[0].token; user1Name = users[0].username;
      const user2Token = users[1].token; user2Name = users[1].username;
      const user3Token = users[2].token; user3Name = users[2].username;

      const treeIds = [
        '10000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000003',
        '10000000-0000-0000-0000-000000000004'
      ];

      // User 1 buys Tree 1 (150) and Tree 2 (250) -> count: 2, total: 400, max: 250
      await request(app.getHttpServer()).put(`/tree/buy`).set('Authorization', `Bearer ${user1Token}`).send({ treeId: treeIds[0], amount: 150, lat: 0, lng: 0 });
      await request(app.getHttpServer()).put(`/tree/buy`).set('Authorization', `Bearer ${user1Token}`).send({ treeId: treeIds[1], amount: 250, lat: 0, lng: 0 });

      // User 2 buys Tree 3 (350) -> count: 1, total: 350, max: 350
      await request(app.getHttpServer()).put(`/tree/buy`).set('Authorization', `Bearer ${user2Token}`).send({ treeId: treeIds[2], amount: 350, lat: 0, lng: 0 });

      // User 3 buys Tree 4 (450) -> count: 1, total: 450, max: 450
      await request(app.getHttpServer()).put(`/tree/buy`).set('Authorization', `Bearer ${user3Token}`).send({ treeId: treeIds[3], amount: 450, lat: 0, lng: 0 });
    });

    it('should get top users by trees count', async () => {
      const response = await request(app.getHttpServer()).get(
        '/user/leaderboard/most-trees',
      );
      console.log('MOST TREES:', response.body);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      
      // User 1 should be first because they have 2 trees
      const user1Index = response.body.findIndex((u: LeaderboardUser) => u.username === user1Name);
      const user2Index = response.body.findIndex((u: LeaderboardUser) => u.username === user2Name);
      
      expect(user1Index).toBeLessThan(user2Index);
      expect(response.body[user1Index].treeCount).toBe(2);
    });

    it('should get top users by total tree value', async () => {
      const response = await request(app.getHttpServer()).get(
        '/user/leaderboard/total-value',
      );
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      
      // Total value: User3 (450) > User1 (400) > User2 (350)
      const u1Idx = response.body.findIndex((u: LeaderboardUser) => u.username === user1Name);
      const u2Idx = response.body.findIndex((u: LeaderboardUser) => u.username === user2Name);
      const u3Idx = response.body.findIndex((u: LeaderboardUser) => u.username === user3Name);
      
      expect(u3Idx).toBeLessThan(u1Idx);
      expect(u1Idx).toBeLessThan(u2Idx);
      expect(response.body[u3Idx].totalValue).toBe(450);
      expect(response.body[u1Idx].totalValue).toBe(400);
    });

    it('should get top users by most expensive tree', async () => {
      const response = await request(app.getHttpServer()).get(
        '/user/leaderboard/most-expensive-tree',
      );
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      
      // Max price: User3 (450) > User2 (350) > User1 (250)
      const u1Idx = response.body.findIndex((u: LeaderboardUser) => u.username === user1Name);
      const u2Idx = response.body.findIndex((u: LeaderboardUser) => u.username === user2Name);
      const u3Idx = response.body.findIndex((u: LeaderboardUser) => u.username === user3Name);
      
      expect(u3Idx).toBeLessThan(u2Idx);
      expect(u2Idx).toBeLessThan(u1Idx);
      expect(response.body[u3Idx].maxTreePrice).toBe(450);
      expect(response.body[u2Idx].maxTreePrice).toBe(350);
    });
  });

  describe('/user/leaderboard (GET) - Mass Scenario', () => {
    const users: { token: string; username: string }[] = [];
    
    beforeAll(async () => {
      // Clear DB to isolate this scenario
      const dataSource = app.get(DataSource);
      await dataSource.query('DELETE FROM "trees"');
      await dataSource.query('DELETE FROM "users"');

      // Create 10 users
      for (let i = 0; i < 10; i++) {
        const email = `mass-test-${i}-${Date.now()}@example.com`;
        await request(app.getHttpServer()).post('/user/register').send({ email, password: 'password123' });
        const login = await request(app.getHttpServer()).post('/user/login').send({ email, password: 'password123' });
        const me = await request(app.getHttpServer()).get('/user/me').set('Authorization', `Bearer ${login.body.accessToken}`);
        users.push({ token: login.body.accessToken, username: me.body.username });
      }

      const buyTree = async (userIndex: number, treeIndex: number, amount: number) => {
        // use upsert directly with uuid
        const treeUuid = `00000000-0000-0000-0000-${treeIndex.toString().padStart(12, '0')}`;
        await request(app.getHttpServer())
          .put(`/tree/buy`)
          .set('Authorization', `Bearer ${users[userIndex].token}`)
          .send({ treeId: treeUuid, amount, lat: 10, lng: 20 });
      };

      // u0 buys 26 trees at 100
      for (let i = 1; i <= 26; i++) {
        await buyTree(0, i, 100);
      }
      
      // u1 buys 15 trees at 100
      for (let i = 27; i <= 41; i++) {
        await buyTree(1, i, 100);
      }

      // u2 buys 1 tree at 2500
      await buyTree(2, 42, 2500);

      // u3 buys 2 trees at 1000
      await buyTree(3, 43, 1000);
      await buyTree(3, 44, 1000);
    }, 30000); // increase timeout for 50+ requests

    it('should correctly rank most-trees on large scale', async () => {
      const response = await request(app.getHttpServer()).get('/user/leaderboard/most-trees');
      expect(response.status).toBe(200);
      
      const ranks = response.body.map((u: LeaderboardUser) => u.username);
      // Order should be u0 > u1 > u3 > u2
      expect(ranks.indexOf(users[0].username)).toBeLessThan(ranks.indexOf(users[1].username));
      expect(ranks.indexOf(users[1].username)).toBeLessThan(ranks.indexOf(users[3].username));
      expect(ranks.indexOf(users[3].username)).toBeLessThan(ranks.indexOf(users[2].username));
    });

    it('should correctly rank total-value on large scale', async () => {
      const response = await request(app.getHttpServer()).get('/user/leaderboard/total-value');
      expect(response.status).toBe(200);
      
      const ranks = response.body.map((u: LeaderboardUser) => u.username);
      console.log('TOTAL VALUE:', response.body);
      // Order should be u0 (2600) > u2 (2500) > u3 (2000) > u1 (1500)
      expect(ranks.indexOf(users[0].username)).toBeLessThan(ranks.indexOf(users[2].username));
      expect(ranks.indexOf(users[2].username)).toBeLessThan(ranks.indexOf(users[3].username));
      expect(ranks.indexOf(users[3].username)).toBeLessThan(ranks.indexOf(users[1].username));
    });

    it('should correctly rank most-expensive-tree on large scale', async () => {
      const response = await request(app.getHttpServer()).get('/user/leaderboard/most-expensive-tree');
      expect(response.status).toBe(200);
      
      const ranks = response.body.map((u: LeaderboardUser) => u.username);
      // Order should be u2 (2500) > u3 (1000)
      expect(ranks.indexOf(users[2].username)).toBeLessThan(ranks.indexOf(users[3].username));
    });
  });
});
