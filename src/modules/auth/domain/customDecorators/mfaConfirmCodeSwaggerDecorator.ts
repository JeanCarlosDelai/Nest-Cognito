import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MFA_CONFIRM_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
export function MfaConfirmCodeSwaggerDecorator() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'MFA Confirm Code',
    }),
    ApiResponse({
      description: 'MFA code confirmed successfully',
      status: 200,
      schema: {
        example: {
          message: MFA_CONFIRM_CODE_SUCCESS,
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
      description: 'Invalid accessToken / Invalid code',
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
            timestamp: '2024-06-17T21:23:51.145Z',
            path: 'undefined/api/v1/auth/mfa/confirmCode',
            error: {
              statusCode: 500,
              message: [
                'Invalid verification code provided, please try again.',
              ],
              error: 'CodeMismatchException',
            },
          },
        ],
      },
    })
  );
}
