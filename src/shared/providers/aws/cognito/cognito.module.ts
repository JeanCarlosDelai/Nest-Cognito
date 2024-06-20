import { Module } from '@nestjs/common';

import { CognitoConfig } from './cognito.config';
import { CognitoProvider } from './implementation/cognito.provider';

@Module({
  providers: [CognitoProvider, CognitoConfig],
  exports: [CognitoProvider, CognitoConfig],
})
// eslint-disable-next-line prettier/prettier
export class CognitoModule {}
