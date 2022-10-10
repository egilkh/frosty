import { Test, TestingModule } from '@nestjs/testing';
import DBService from './db.service';

describe('DBService', () => {
  let dbService: DBService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [DBService],
    }).compile();

    dbService = app.get(DBService);
  });

  it('should be defined', () => {
    expect(dbService).toBeInstanceOf(DBService);
  });
});
