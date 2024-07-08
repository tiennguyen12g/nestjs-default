// export class ResponseData<D>{
//     data: D | D[];
//     statusCode: number;
//     message: string;

//     constructor(    
//         data: D | D[],
//         statusCode: number,
//         message: string,
//     ){
//         this.data = data;
//         this.statusCode = statusCode;
//         this.message = message;
//         return this;
//     }
// }
interface ResponseDataProps<D>{
    data: D | D[];
    statusCode: number;
    defaultMessage: string;
}
interface ResponseDataOutput<D> extends ResponseDataProps<D>{
}
interface ResponseDataError{
    data: {
        errorMessage: string,
        errorAction: string,
    };
    statusCode: number;
    defaultMessage: string;
}
export function ResponseData<D>({data, statusCode, defaultMessage}: ResponseDataProps<D>): ResponseDataOutput<D>{
    return {
        data: data,
        statusCode: statusCode,
        defaultMessage: defaultMessage,
    }
}

export {
    ResponseDataOutput, 
    ResponseDataError,
}