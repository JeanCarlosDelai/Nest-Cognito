import { InternalServerErrorException } from '@nestjs/common';
import { ExceptionCode } from 'src/shared/common/utils/exceptionCode';
import { Throws } from 'src/shared/providers/aws/cognito/enum/throws.enum';

describe('exceptionCode', () => {
  test('Deve resolver com mensagem de erro "Erro interno no servidor"', async () => {
    // Arrange
    const error = Throws.ALIAS_EXISTS_EXCEPTION;
    const errorMessage = 'Error';
    const expectedError = new InternalServerErrorException({
      statusCode: 500,
      message: [errorMessage],
      error: error,
    });
    // Act
    const response = await ExceptionCode(error, errorMessage);
    // Assert
    expect(response).toEqual(expectedError);
    expect(response).toBeInstanceOf(InternalServerErrorException);
  });
});
