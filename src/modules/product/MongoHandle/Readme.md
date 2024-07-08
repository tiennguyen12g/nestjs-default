## In NestJS, we have two ways to connect Mongodb for each way of using it.
### 1. Using Mongoose with class function
#### How to connect
1. Install
```
npm i @nestjs/mongoose mongoose
```
2. At "app.module.ts"
```
import { Module, Logger,} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { MongooseModule, } from '@nestjs/mongoose';
const mongoDB_URL = process.env.MONGODB_URI || "mongodb://localhost:27017/TestNestJS";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductModule,
    MongooseModule.forRoot(mongoDB_URL,{
      connectionFactory:async (connection) => {
        const logger = new Logger();
        connection.on('connected', () => {
          console.log('MongoDB connected successfully');
          logger.log('MongoDB connected successfully');
        });
        connection.on('disconnected', () => {
          console.log('MongoDB disconnected');
        });
        connection.on('error', (error: any) => {
          console.log('MongoDB connection error: ', error);
        });
        connection._events.connected();
        return connection;
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
3. At project module. Example "product.module.ts"
```
import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductModel } from "./product.schema";
@Module({
    imports:[
        MongooseModule.forFeature([
            { name: 'Product', schema: ProductModel.schema }
        ])
    ],
    controllers:[ProductController],
    providers:[ProductService]
})
export class ProductModule{};
```
4. At "product.model.ts"
```
import { Schema, Document, Model, model, models } from 'mongoose';

interface ProductSchemaType extends Document {
  id: number;
  product_name: string;
  price: number;
  category?: string;
}

const collectionName = "Product";
const ProductSchema: Schema<ProductSchemaType> = new Schema({
  id:{type: Number, required: true},
  product_name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
}, { collection: collectionName });

/**
 * @Product Model
 * + It contain collection name and Product Schema (Model.schema).
 */
const ProductModel: Model<ProductSchemaType> = models.Product || model<ProductSchemaType>('Product', ProductSchema);

export { ProductSchemaType, ProductModel };
```
5. At "product.service.ts"
```
import { Injectable } from '@nestjs/common';
import { ProductSchemaType } from './product.model';
import { Product_BaseBodyType, Product_QueryType } from './product.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private productModel: Model<ProductSchemaType>) {}

  /**
   * @GET All
   */
  async getProducts(): Promise<ProductSchemaType[]> {
    try {
      const result = await mongodb_getProducts();
      const allProducts: ProductSchemaType[] = await this.productModel.find().exec();
      return allProducts;
    } catch (error) {
      console.log('getProducts Error:', error.message, 'ProductService');
      throw new Error(error.message);
    }
  }
} 
```
6. Done. We can call at controller.
### 2. Using Mongoose with function
1. Install
```
npm i @nestjs/mongoose mongoose
```
2. At "app.module.ts"
```
import { Module, Logger,} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import mongoose from 'mongoose';
const mongoDB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/TestNestJS";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProductModule,
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
    mongoose.connect(mongoDB_URI)
    .then(() => {
      console.log('MongoDB connected successfully');
    }).catch((err) => {
      console.log("Connect mongodb error:", err);
    })
  }
}

```
3. At project module. Example "product.module.ts"
```
import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { ProductModel } from "./product.schema";
@Module({
    imports:[
    ],
    controllers:[ProductController],
    providers:[ProductService]
})
export class ProductModule{};
```
4. At "product.model.ts"
```
import { Schema, Document, Model, model, models } from 'mongoose';

interface ProductSchemaType extends Document {
  id: number;
  product_name: string;
  price: number;
  category?: string;
}

const collectionName = "Product";
const ProductSchema: Schema<ProductSchemaType> = new Schema({
  id:{type: Number, required: true},
  product_name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
}, { collection: collectionName });

/**
 * @Product Model
 * + It contain collection name and Product Schema (Model.schema).
 */
const ProductModel: Model<ProductSchemaType> = models.Product || model<ProductSchemaType>('Product', ProductSchema);

export { ProductSchemaType, ProductModel };
```
5. At "product.mongo.ts". In here, you can code as your code that used in express.
```
import { ProductModel, ProductSchemaType } from './product.model';
import { Product_BaseBodyType, Product_QueryType } from './product.interface';
/**
 * @GET All
 */
async function mongodb_getProducts(): Promise<ProductSchemaType[]> {
  try {
    console.log('1');
    const allProducts: ProductSchemaType[] = await ProductModel.find();
    return allProducts;
  } catch (error) {
    console.log('getProducts Error:', error.message, 'ProductService');
    throw new Error(error.message);
  }
}
```
6. At "product.controller.ts"
```
import {Controller,Get} from '@nestjs/common';
import { ResponseData, ResponseDataOutput } from '../../global/GlobalResponseData';
import { HttpStatus, HttpMessage } from '../../global/GlobalResponseEnum';
import { ProductSchemaType } from './product.model';
import { Product_BaseBodyType, Product_ErrorOutput, Product_QueryType } from './product.interface';
import { ZodValidationPipe } from 'src/validation.pipe';
import { 
  mongodb_getProducts, 
  mongodb_createProduct,
  mongodb_updateProduct,
  mongodb_deleteProduct,
  mongodb_getProductByCondition
}
from './product.mongo';
export class ProductControllerNonService {

  /**
   * @GET All
   */
  @Get()
  async getProducts(): Promise<ResponseDataOutput<ProductSchemaType[] | Product_ErrorOutput>> {
    try {
      return ResponseData<ProductSchemaType[]>({
        data: await mongodb_getProducts(),
        statusCode: HttpStatus.SUCCESS,
        defaultMessage: HttpMessage.SUCCESS,
      });
    } catch (error) {
      console.log('getProducts', error);
      return ResponseData<Product_ErrorOutput>({
        data: {
          errorMessage: error.message,
          errorAction: "getProducts",
        },
        statusCode: HttpStatus.ERROR,
        defaultMessage: HttpMessage.ERROR,
      });
    }
  }
}
```
7. Done. Go to test your code.