import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
export function GetInfoUserSwaggerDecorator() {
  return applyDecorators(
    ApiTags('User'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get Info User Attributes',
    }),
    ApiResponse({
      description: 'User Attributtes list',
      status: 200,
      schema: {
        example: {
          username: '01234567899',
          userAttributes: [
            {
              Name: 'email',
              Value: 'test@test.com.br',
            },
            {
              Name: 'email_verified',
              Value: 'true',
            },
            {
              Name: 'phone_number',
              Value: '+5554999008899',
            },
            {
              Name: 'phone_number_verified',
              Value: 'false',
            },
            {
              Name: 'name',
              Value: 'test',
            },
            {
              Name: 'birthdate',
              Value: '12/12/2000',
            },
            {
              Name: 'custom:last_name',
              Value: 'test',
            },
            {
              Name: 'sub',
              Value: '312313231',
            },
          ],
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
    ApiUnauthorizedResponse({
      description: 'Invalid Bearer Token',
      schema: {
        example: {
          timestamp: '2024-06-17T19:37:22.382Z',
          path: 'undefined/api/v1/user/info',
          error: {
            statusCode: 401,
            message: 'Unauthorized',
          },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Invalid accessToken',
      schema: {
        example: {
          timestamp: '2024-06-17T19:36:45.648Z',
          path: 'undefined/api/v1/user/info',
          error: {
            statusCode: 500,
            message: ['Could not verify signature for Access Token'],
            error: 'NotAuthorizedException',
          },
        },
      },
    })
  );
}
