import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DELETED_USER_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
export function DeleteUserSwaggerDecorator() {
  return applyDecorators(
    ApiTags('User'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete User',
    }),
    ApiResponse({
      description: 'User Deleted Successfully',
      status: 200,
      schema: {
        example: {
          message: DELETED_USER_SUCCESS,
        },
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
