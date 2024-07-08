import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ResponseData, ResponseDataOutput } from '../../global/GlobalResponseData';
import { HttpStatus, HttpMessage } from '../../global/GlobalResponseEnum';
// import { Product } from './product.model';
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
from './MongoHandle/product.mongo';


@Controller('v1/products')
export class ProductControllerNonService {

  // constructor(private readonly productService: ProductService) {

  // }

  /**  
   * @ Note
   * + 1. Query Parameters: Used for filtering, sorting, and pagination. Suitable for GET and DELETE requests.
   * + 2. Body Parameters: Used for sending larger amounts of data, typically in POST, PUT, and PATCH requests.
   * + 3. Route Parameters (Params): Used for identifying specific resources or nested resources in the URL path. 
   * Suitable for all types of requests where a specific resource is being targeted.
   */

  /** 
    * # In POST, PUT, PATCH
    * ? Why do we use Product_BaseBodyType? 
    * Because we need to validate the body of the request which similar like: length, size, limit value ...
    * So, we use ZodValidationPipe to validate the body of the request.
    */

  /** 
   * # In GET, DELETE
   * We use "Product" model type because the function return the exactly value which required in "Product" model.
   */

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

  /**
   * @CREATE
   * #param productBody 
   * #returns 
   */
  @Post()
  async createProduct(
    @Body(new ZodValidationPipe({schema: Product_BaseBodyType, action: "createProduct",})) productBody: Product_BaseBodyType,
  ): Promise<ResponseDataOutput<Product_BaseBodyType | Product_ErrorOutput>> {
    try {
      return ResponseData<Product_BaseBodyType>({
        data: await mongodb_createProduct(productBody),
        statusCode: HttpStatus.SUCCESS,
        defaultMessage: HttpMessage.SUCCESS,
      });
    } catch (error) {
      console.log('createProduct', error);
      return ResponseData<Product_ErrorOutput>({
        data: {
          errorMessage: error.message,
          errorAction: "createProduct",
        },
        statusCode: HttpStatus.ERROR,
        defaultMessage: HttpMessage.ERROR,
      });
    }
  }
  
  /**
   * @GET By Condition
   */
  @Get('/:productID')
  async getProductByCondition(
    @Param('productID') productID: number,
    @Query(new ZodValidationPipe({schema: Product_QueryType, action:"getProductByCondition"})) queryInfos: Product_QueryType,
  ): Promise<ResponseDataOutput<ProductSchemaType[] | Product_ErrorOutput>> {
    try {
      const {price, category} = queryInfos;
      return ResponseData<ProductSchemaType[]>({
        data: await mongodb_getProductByCondition(productID, queryInfos),
        statusCode: HttpStatus.SUCCESS,
        defaultMessage: HttpMessage.SUCCESS,
      });
    } catch (error) {
      console.log('getProductByCondition', error);
      return ResponseData<Product_ErrorOutput>({
        data: {
            errorMessage: error.message,
            errorAction: "getProductByCondition",
          },
        statusCode: HttpStatus.ERROR,
        defaultMessage: HttpMessage.ERROR,
      });
    }
  }

  /**
   * @PUT
   */
  @Put()
  async updateProduct(
    @Body(new ZodValidationPipe({schema: Product_BaseBodyType, action:"updateProduct"})) updateBody: Product_BaseBodyType,
  ): Promise<ResponseDataOutput<Product_BaseBodyType | Product_ErrorOutput>> {
    try {
      return ResponseData<Product_BaseBodyType>({
        data:await mongodb_updateProduct(updateBody),
        statusCode: HttpStatus.SUCCESS,
        defaultMessage: HttpMessage.SUCCESS,
      });
    } catch (error) {
      console.log('updateProduct', error);
      return ResponseData<Product_ErrorOutput>({
        data: {
          errorMessage: error.message,
          errorAction: "updateProduct",
        },
        statusCode: HttpStatus.ERROR,
        defaultMessage: HttpMessage.ERROR,
      });
    }
  }

  /**
   * @DELETE
   */
  @Delete('/:productID')
  async deleteProduct(
    @Param('productID') productID: number,
  ): Promise<ResponseDataOutput<string | Product_ErrorOutput>> {
    try {
      return ResponseData<string>({
        data: await mongodb_deleteProduct(productID),
        statusCode: HttpStatus.SUCCESS,
        defaultMessage: HttpMessage.SUCCESS,
      });
    } catch (error) {
      console.log('deleteProduct', error);
      return ResponseData<Product_ErrorOutput>({
        data: {
          errorMessage: error.message,
          errorAction: "updateProduct",
        },
        statusCode: HttpStatus.ERROR,
        defaultMessage: HttpMessage.ERROR,
      });
    }
  }
}
