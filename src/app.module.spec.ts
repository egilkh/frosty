import { AppModule } from './app.module';

describe('AppModule', () => {
  it('should be defined', () => {
    const appModule = new AppModule();

    expect(appModule).toBeInstanceOf(AppModule);
  });
});
