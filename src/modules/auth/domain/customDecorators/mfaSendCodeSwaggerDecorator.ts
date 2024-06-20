import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MFA_SEND_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
export function MfaSendCodeSwaggerDecorator() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'MFA Send Code',
    }),
    ApiResponse({
      description: 'MFA send code successfully',
      status: 200,
      schema: {
        example: {
          message: MFA_SEND_CODE_SUCCESS,
          Destination: 't***@t***',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid Bearer Token',
      schema: {
        example: {
          timestamp: '2024-06-17T19:37:22.382Z',
          path: 'undefined/api/v1/auth/mfa/sendcode',
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
          timestamp: '2024-06-17T21:10:29.807Z',
          path: 'undefined/api/v1/auth/mfa/sendcode',
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
