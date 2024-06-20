import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/infra/auth.module';
import { CognitoModule } from './shared/providers/aws/cognito/cognito.module';
import { ResetModule } from './modules/reset/infra/reset.module';
import { UserModule } from './modules/user/infra/user.module';

@Module({
  imports: [
    AuthModule,
    CognitoModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ResetModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
// eslint-disable-next-line prettier/prettier
export class AppModule {}
