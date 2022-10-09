import { NotImplementedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeInstanceOf(AppController);
  });

  describe('create', () => {
    it('should call service.create', () => {
      throw new NotImplementedException();
    });
  });

  describe('read', () => {
    it('should call service.read', () => {
      throw new NotImplementedException();
    });
  });

  describe('update', () => {
    it('should call service.update', () => {
      throw new NotImplementedException();
    });
  });

  describe('delete', () => {
    it('should call service.delete', () => {
      throw new NotImplementedException();
    });
  });
});
