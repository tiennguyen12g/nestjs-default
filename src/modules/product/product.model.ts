// interface Product{
//     id: number;
//     product_name: string;
//     price: number;
//     category?: string;
// }

// export {Product}
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
