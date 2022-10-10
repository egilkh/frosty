import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import DBService from './db.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: DBService,
          useValue: createMock<DBService>(),
        },
      ],
    }).compile();

    appService = app.get(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeInstanceOf(AppService);
  });
});
