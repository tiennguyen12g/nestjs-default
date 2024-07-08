import { Module, Logger,} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { MongooseModule, } from '@nestjs/mongoose';
import mongoose from 'mongoose';
const mongoDB_URL = process.env.MONGODB_URI || "mongodb://localhost:27017/TestNestJS";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductModule,
    /**
     * @Connect Mongodb 
     * This way is suitable when you familiar with class function.
     */
    // MongooseModule.forRoot(mongoDB_URL,{
    //   connectionFactory:async (connection) => {
    //     const logger = new Logger();
    //     connection.on('connected', () => {
    //       console.log('MongoDB connected successfully');
    //       logger.log('MongoDB connected successfully');
    //     });
    //     connection.on('disconnected', () => {
    //       console.log('MongoDB disconnected');
    //     });
    //     connection.on('error', (error: any) => {
    //       console.log('MongoDB connection error: ', error);
    //     });
    //     connection._events.connected();
    //     return connection;
    //   },
    // })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(){
    /**
     * @Connect Mongodb 
     * This way is suitable when you dont want to use class function and inject Model in service.
     */
    mongoose.connect(mongoDB_URL).then(() => {
      console.log('MongoDB connected successfully');
    }).catch((err) => {
      console.log("Connect mongodb error:", err);
    })
  }
}
