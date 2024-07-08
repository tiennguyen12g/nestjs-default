import { Module } from "@nestjs/common";
import { ProductController } from "./defaultModule.controller";
import { ProductService } from "./defaultModule.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductModel } from "./defaultModule.schema";
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