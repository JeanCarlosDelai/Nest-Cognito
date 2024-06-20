import * as env from 'env-var';

export const config = {
  COGNITO_CLIENT_ID: env.get('COGNITO_CLIENT_ID').required().asString(),
  COGNITO_USER_POOL_ID: env.get('COGNITO_USER_POOL_ID').required().asString(),
  AWS_REGION: env.get('AWS_REGION').required().asString(),
  AWS_ACCESS_KEY_ID: env.get('AWS_ACCESS_KEY_ID').required().asString(),
  AWS_SECRET_KEY: env.get('AWS_SECRET_KEY').required().asString(),
  PORT: env.get('PORT').required().asIntPositive(),
};
