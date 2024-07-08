import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare const module: any;
const port = process.env.SERVER_PORT;
const listenIP = process.env.SERVER_LISTEN;
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: ['error', 'warn'], // false to disable or Values in the array can be any combination of 'log', 'fatal', 'error', 'warn', 'debug', and 'verbose'.
  });
  await app.listen(port,listenIP,()=>{
    console.log(`Server is running on http://${listenIP}:${port}`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
