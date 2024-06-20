import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
export function LoginSwaggerDecorator() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary: 'Login',
    }),
    ApiResponse({
      description: 'Login Successfully',
      status: 200,
      schema: {
        example: {
          AccessToken: 'token',
          IdToken: 'token',
          RefreshToken: 'token',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid username',
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
        ],
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Incorrect username or password / User does not exist',
      schema: {
        example: [
          {
            timestamp: '2024-06-17T21:04:41.593Z',
            path: 'undefined/api/v1/auth/login',
            error: {
              statusCode: 500,
              message: ['Incorrect username or password.'],
              error: 'NotAuthorizedException',
            },
          },
          {
            timestamp: '2024-06-17T21:05:02.672Z',
            path: 'undefined/api/v1/auth/login',
            error: {
              statusCode: 500,
              message: ['User does not exist.'],
              error: 'UserNotFoundException',
            },
          },
        ],
      },
    })
  );
}
