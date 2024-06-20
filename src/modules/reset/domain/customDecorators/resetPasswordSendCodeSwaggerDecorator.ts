import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RESET_PASSWORD_SEND_CODE_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
export function ResetPasswordSendCodeSwaggerDecorator() {
  return applyDecorators(
    ApiTags('Reset'),
    ApiOperation({
      summary: 'Reset Password Send Code',
    }),
    ApiResponse({
      description: 'Send code successfully',
      status: 200,
      schema: {
        example: {
          message: RESET_PASSWORD_SEND_CODE_SUCCESS,
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
      description: 'User not found',
      schema: {
        example: {
          timestamp: '2024-06-17T22:22:11.153Z',
          path: 'undefined/api/v1/reset/password/sendcode',
          error: {
            statusCode: 500,
            message: ['Username/client id combination not found.'],
            error: 'UserNotFoundException',
          },
        },
      },
    })
  );
}
