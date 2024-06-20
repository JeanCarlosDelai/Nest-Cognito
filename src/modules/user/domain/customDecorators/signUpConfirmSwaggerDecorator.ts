import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SIGN_UP_CONFIRM_SUCCESS } from 'src/shared/common/consts/SuccessConstants';
export function SignUpConfirmSwaggerDecorator() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({
      summary: 'Sign Up Confirm',
    }),
    ApiResponse({
      description: 'User Successfully Confirmed',
      status: 201,
      schema: {
        example: {
          message: SIGN_UP_CONFIRM_SUCCESS,
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
      description: 'Invalid verification code',
      schema: {
        example: [
          {
            timestamp: '2024-06-17T16:40:34.388Z',
            path: 'undefined/api/v1/user/sign-up/confirm',
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
