import { Injectable } from '@nestjs/common';
import { Product } from './defaultModule.model';
import { Product_BaseBodyType, Product_QueryType } from './defaultModule.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductSchemaType } from './defaultModule.schema';
@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private productModel: Model<ProductSchemaType>) {}

  /**
   * @GET All
   */
  async getProducts(): Promise<Product[]> {
    try {
      const allProducts: Product[] = await this.productModel.find().exec();
      return allProducts;
    } catch (error) {
      console.log('getProducts Error:', error.message, 'ProductService');
      throw new Error(error.message);
    }
  }
  /**
   * @CREATE
   * #param productBody
   * #returns
   */
  async createProduct(productBody: Product_BaseBodyType): Promise<Product_BaseBodyType> {
    try {
      const newProduct: Product_BaseBodyType = {
        id: productBody.id,
        product_name: productBody.product_name,
        price: productBody.price || 0,
        category: productBody.category || 'Software',
      };
      const createdProduct = new this.productModel(newProduct);
      await createdProduct.save(); // Save the product to the database
      console.log(`Product created: ${JSON.stringify(createdProduct)}`);
      return createdProduct.toObject(); // Return the created product
    } catch (error) {
      throw new Error(error.message); // Throw error to be caught by the controller
    }
  }
  /**
   * @GET By Condition
   */
  async getProductByCondition(productID: number, queryInfos: Product_QueryType): Promise<Product[]> {
    try {
      //  Add all condition if it was passed from client.
      const conditions: any = { id: productID };
      if (queryInfos.price !== undefined) {
        conditions.price = queryInfos.price;
      }
      if (queryInfos.category !== undefined) {
        conditions.category = queryInfos.category;
      }

      const product = await this.productModel.find(conditions);
      console.log('product result', product);
      return product;
    } catch (error) {
      console.log('getProductByCondition Error:', error.message, 'ProductService');
      throw new Error(error.message);
    }
  }
  /**
   * @PUT
   */
  async updateProduct(updateBody: Product_BaseBodyType): Promise<Product_BaseBodyType> {
    try {
      const productID = updateBody.id;
      const newProduct = { ...updateBody };
      delete newProduct.id;
      const updateProduct = await this.productModel
        .findOneAndUpdate({ id: productID }, { $set: { ...newProduct } }, { new: true })
        .exec();
      console.log(`Product updated: ${JSON.stringify(updateProduct)}`);
      return updateProduct.toObject();
    } catch (error) {
      console.log('updateProduct Error:', error.message, 'ProductService');
      throw new Error(error.message);
    }
  }
  /**
   * @DELETE
   */
  async deleteProduct(productID: number): Promise<string> {
    const deleteProduct = await this.productModel.findOneAndDelete({ id: productID }).exec();
    console.log(`Product deleted: ${JSON.stringify(deleteProduct)}`);
    return `Delete product ${deleteProduct.product_name} successfully`;
  }
}
