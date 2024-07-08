import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  private schema: ZodSchema<any>;
  private action: string;
  constructor({ schema, action }: { schema: ZodSchema<any>; action: string }){
    this.schema = schema;
    this.action = action;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    const validation = this.schema.safeParse(value);
    if (!validation.success) {
      throw new BadRequestException({
        action: this.action,
        message: 'Validation failed',
        errors: validation.error.errors,
      });
    }
    return validation.data;
  }
}
