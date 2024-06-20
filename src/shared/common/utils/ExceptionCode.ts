import { InternalServerErrorException } from '@nestjs/common';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';

export async function ExceptionCode(
  error: Throws,
  message: string
): Promise<InternalServerErrorException> {
  return new InternalServerErrorException({
    statusCode: 500,
    message: [message],
    error: error,
  });
}
