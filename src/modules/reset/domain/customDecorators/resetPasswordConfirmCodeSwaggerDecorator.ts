import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CHANGE_PASSWORD_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
export function ResetPasswordConfirmCodeSwaggerDecorator() {
  return applyDecorators(
    ApiTags('Reset'),
    ApiOperation({
      summary: 'Reset Password Confirm Code',
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
      description: 'User not found / Invalid Code',
      schema: {
        example: [
          {
            timestamp: '2024-06-17T22:22:11.153Z',
            path: 'undefined/api/v1/reset/password',
            error: {
              statusCode: 500,
              message: ['Username/client id combination not found.'],
              error: 'UserNotFoundException',
            },
          },
          {
            timestamp: '2024-06-17T22:58:35.435Z',
            path: 'undefined/api/v1/reset/password',
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
