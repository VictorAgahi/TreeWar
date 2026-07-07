import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
const request = require('supertest');
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Tree Module (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let treeId: string;

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

  describe('/tree (POST) - Create', () => {
    it('should create a new tree', async () => {
      const createPayload = {
        name: 'Chêne centenaire',
        lat: 48.8566,
        lng: 2.3522,
        price: 200,
      };

      const response = await request(app.getHttpServer())
        .post('/tree')
        .send(createPayload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'Chêne centenaire');
      expect(response.body).toHaveProperty('price', 200);
      treeId = response.body.id;
    });
  });

  describe('/tree/:id/buy (PUT) - Buy', () => {
    it('should fail to buy tree if not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .put(`/tree/${treeId}/buy`)
        .send({ amount: 300, lat: 48.8566, lng: 2.3522 });

      expect(response.status).toBe(401);
    });

    it('should fail to buy tree if amount is too low', async () => {
      const response = await request(app.getHttpServer())
        .put(`/tree/${treeId}/buy`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ amount: 150, lat: 48.8566, lng: 2.3522 }); // Tree price is 200

      expect(response.status).toBe(400);
    });

    it('should successfully buy tree, deduct credits, and rename it', async () => {
      const response = await request(app.getHttpServer())
        .put(`/tree/${treeId}/buy`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ amount: 300, lat: 48.8566, lng: 2.3522, newName: 'Mon Super Arbre' });

      expect(response.status).toBe(200); // OK (NestJS PUT default)
      expect(response.body).toHaveProperty('price', 300);
      expect(response.body).toHaveProperty('ownerId');
      expect(response.body).toHaveProperty('name', 'Mon Super Arbre');

      // Verify credits are deducted
      const meRes = await request(app.getHttpServer())
        .get('/user/me')
        .set('Authorization', `Bearer ${accessToken}`);
      
      expect(meRes.status).toBe(200);
      // user starts with 3000 credits, deducted 300 -> 2700
      expect(meRes.body.credits).toBe(2700);
    });
  });
});
