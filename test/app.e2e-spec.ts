import type { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/', () => {
    it('should error on GET', async () => {
      const response = await request(app.getHttpServer()).get('/');
      const body = response.body as Record<string, unknown>;

      expect(response.statusCode).toBe(400);
      expect(body['message']).toBe(
        'At least one collection needs to be part of url',
      );
    });
  });
});
