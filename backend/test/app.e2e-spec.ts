import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('User Module (e2e)', () => {
  let app: INestApplication<App>;
  let userEmail: string;
  const userPassword = 'password123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(new ValidationPipe());
    
    await app.init();
    userEmail = `test-${Date.now()}@example.com`;
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
});
