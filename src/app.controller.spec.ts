import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import type { Request } from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import DBService from './db.service';
import type BodyObject from './types/body-object.type';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: createMock<AppService>(),
        },
        {
          provide: DBService,
          useValue: createMock<DBService>(),
        },
      ],
    }).compile();

    appController = app.get(AppController);
    appService = app.get(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeInstanceOf(AppController);
  });

  const mockBody = createMock<BodyObject>({
    title: 'title',
  });
  const mockRequest = createMock<Request>({
    url: '/collection',
  });

  describe('create', () => {
    it('should call service', async () => {
      const createSpy = jest
        .spyOn(appService, 'create')
        .mockResolvedValue(mockBody);

      const result = await appController.create(mockRequest, mockBody);

      expect(result).toBeTruthy();
      expect(createSpy).toHaveBeenCalledWith(mockRequest, mockBody);
    });
  });

  describe('read', () => {
    it('should call service', async () => {
      const readSpy = jest
        .spyOn(appService, 'read')
        .mockResolvedValue([mockBody]);

      const result = await appController.read(mockRequest, {});

      expect(result).toBeTruthy();
      expect(readSpy).toHaveBeenCalledWith(mockRequest, {});
    });
  });

  describe('update', () => {
    it('should call service', async () => {
      const updateSpy = jest
        .spyOn(appService, 'patch')
        .mockResolvedValue(mockBody);

      const result = await appController.update(mockRequest, mockBody);

      expect(result).toBeTruthy();
      expect(updateSpy).toHaveBeenCalledWith(mockRequest, mockBody);
    });
  });

  describe('delete', () => {
    it('should call service', async () => {
      const deleteSpy = jest.spyOn(appService, 'delete').mockResolvedValue({
        path: '/delete',
        deleted: true,
      });

      const result = await appController.delete(mockRequest);

      expect(result).toBeTruthy();
      expect(deleteSpy).toHaveBeenCalledWith(mockRequest);
    });
  });
});
