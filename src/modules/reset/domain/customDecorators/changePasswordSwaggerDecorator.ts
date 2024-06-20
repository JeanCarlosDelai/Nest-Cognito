import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CHANGE_PASSWORD_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
export function ChangePasswordSwaggerDecorator() {
  return applyDecorators(
    ApiTags('Reset'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Change Password',
    }),
    ApiResponse({
      description: 'Password changed successfully',
      status: 200,
      schema: {
        example: {
          message: CHANGE_PASSWORD_SUCCESS,
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid Bearer Token',
      schema: {
        example: {
          timestamp: '2024-06-17T19:37:22.382Z',
          path: 'undefined/api/v1/auth/mfa/confirmCode',
          error: {
            statusCode: 401,
            message: 'Unauthorized',
          },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Invalid accessToken / Incorrect password',
      schema: {
        example: [
          {
            example: {
              timestamp: '2024-06-17T21:10:29.807Z',
              path: 'undefined/api/v1/auth/mfa/confirmCode',
              error: {
                statusCode: 500,
                message: ['Could not verify signature for Access Token'],
                error: 'NotAuthorizedException',
              },
            },
          },
          {
            timestamp: '2024-06-17T21:48:22.126Z',
            path: 'undefined/api/v1/auth/reset/password',
            error: {
              statusCode: 500,
              message: ['Incorrect username or password.'],
              error: 'NotAuthorizedException',
            },
          },
        ],
      },
    })
  );
}
