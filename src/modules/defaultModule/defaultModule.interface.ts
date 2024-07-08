//** Use zod to validator field */
import { z } from "zod";

//**Define data from Body */
const Product_BaseBodyType = z.object({
    id: z.number(),
    product_name: z.string().min(5,"This field must be more than 5 characters"),
    price: z.number({
        required_error: "This field is required",
        invalid_type_error: "This field must be a number",
    }).gte(10, {message: "price must be grater than 10"}),
    category: z.string().optional(),
});
type Product_BaseBodyType = z.infer<typeof Product_BaseBodyType>;

/** 
 * # It is similar with the below interface, but it is explicit about type and its limited. 
*/
// interface Product_BaseBodyType {
//     id: number;
//     product_name: string;
//     price: number;
//     category?: string;
// }

//**Define data from Query */
const Product_QueryType = z.object({
    price: z.number().optional(),
    category: z.string().min(2, "This field must be more than 1 character").optional(),
})
type Product_QueryType = z.infer<typeof Product_QueryType>;

//**Define Product answer when error finding data in database */
interface Product_ErrorOutput{
    errorMessage: string,
    errorAction: string,
}

export { 
    Product_BaseBodyType,
    Product_ErrorOutput,
    Product_QueryType,
}