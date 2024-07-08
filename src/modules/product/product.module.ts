import { Module } from "@nestjs/common";
// import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductModel } from "./product.schema";
import { ProductControllerNonService } from "./productNonService.controller";
@Module({
    imports:[
        // MongooseModule.forFeature([
        //     { name: 'Product', schema: ProductModel.schema }
        // ])
    ],
    controllers:[ProductControllerNonService],
    // providers:[ProductService]
})
export class ProductModule{};