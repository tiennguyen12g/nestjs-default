import { ProductModel, ProductSchemaType } from '../product.model';
import { Product_BaseBodyType, Product_QueryType } from '../product.interface';
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

/**
 * @CREATE
 * #param productBody
 * #returns
 */
async function mongodb_createProduct(productBody: Product_BaseBodyType): Promise<Product_BaseBodyType> {
  try {
    const newProduct: Product_BaseBodyType = {
      id: productBody.id,
      product_name: productBody.product_name,
      price: productBody.price || 0,
      category: productBody.category || 'Software',
    };
    const createdProduct =await ProductModel.create(newProduct);
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
async function mongodb_getProductByCondition(productID: number, queryInfos: Product_QueryType): Promise<ProductSchemaType[]> {
  try {
    //  Add all condition if it was passed from client.
    const conditions: any = { id: productID };
    if (queryInfos.price !== undefined) {
      conditions.price = queryInfos.price;
    }
    if (queryInfos.category !== undefined) {
      conditions.category = queryInfos.category;
    }

    const product = await ProductModel.find(conditions);
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
async function mongodb_updateProduct(updateBody: Product_BaseBodyType): Promise<Product_BaseBodyType> {
  try {
    const productID = updateBody.id;
    const newProduct = { ...updateBody };
    delete newProduct.id;
    const updateProduct = await ProductModel.findOneAndUpdate(
        { id: productID }, 
        { $set: { ...newProduct } }, 
        { new: true }
    )
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
async function mongodb_deleteProduct(productID: number): Promise<string> {
  const deleteProduct = await ProductModel.findOneAndDelete({ id: productID });
  console.log(`Product deleted: ${JSON.stringify(deleteProduct)}`);
  return `Delete product ${deleteProduct.product_name} successfully`;
}
export { 
    mongodb_getProducts, 
    mongodb_createProduct,
    mongodb_updateProduct,
    mongodb_deleteProduct,
    mongodb_getProductByCondition
};
