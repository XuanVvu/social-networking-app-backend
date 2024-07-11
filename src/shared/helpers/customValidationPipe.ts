import { ValidationPipe, BadRequestException } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints)[0],
        }));
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: result,
        });
      },
    });
  }
}
