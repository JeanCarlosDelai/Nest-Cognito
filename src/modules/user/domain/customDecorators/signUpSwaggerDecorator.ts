import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SIGN_UP_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
export function SignUpSwaggerDecorator() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({
      summary: 'Sign Up',
    }),
    ApiResponse({
      description: 'User Successfully registered',
      status: 201,
      schema: {
        example: {
          message: SIGN_UP_SUCCESS,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid username / Invalid phoneNumber / Invalid birthdate',
      schema: {
        example: [
          {
            timestamp: '2024-06-17T15:59:36.596Z',
            path: 'undefined/api/v1/user',
            error: {
              statusCode: 400,
              message: [
                'Please provide a valid username, format:  012345678900',
              ],
              error: 'Bad Request',
            },
          },
          {
            timestamp: '2024-06-17T16:01:49.137Z',
            path: 'undefined/api/v1/user',
            error: {
              statusCode: 400,
              message: [
                'Please provide a valid phoneNumber, format: +5554987654321',
              ],
              error: 'Bad Request',
            },
          },
          {
            timestamp: '2024-06-17T16:02:16.817Z',
            path: 'undefined/api/v1/user',
            error: {
              statusCode: 400,
              message: ['Please provide a valid birthdate, format: dd/MM/yyyy'],
              error: 'Bad Request',
            },
          },
        ],
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'User already exists',
      schema: {
        example: [
          {
            timestamp: '2024-06-17T16:40:34.388Z',
            path: 'undefined/api/v1/user',
            error: {
              statusCode: 500,
              message: ['User already exists'],
              error: 'UsernameExistsException',
            },
          },
        ],
      },
    })
  );
}
