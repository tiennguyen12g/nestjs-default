import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
declare const module: any;
const port = process.env.SERVER_PORT;
console.log('port', port);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
