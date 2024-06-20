import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
export function ValidateUserSwaggerDecorator() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({
      summary: 'Validate User Status',
    }),
    ApiResponse({
      description: 'User Status',
      status: 200,
      schema: {
        example: {
          userStatus: 'CONFIRMED',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid username',
      schema: {
        example: [
          {
            timestamp: '2024-06-17T15:59:36.596Z',
            path: 'undefined/api/v1/user/validate?username=132456984',
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
      description: 'User does not exist',
      schema: {
        example: {
          timestamp: '2024-06-17T20:10:44.298Z',
          path: 'undefined/api/v1/user/validate?username=',
          error: {
            statusCode: 500,
            message: ['User does not exist.'],
            error: 'UserNotFoundException',
          },
        },
      },
    })
  );
}
