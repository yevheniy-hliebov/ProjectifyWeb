import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../modules/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory:async (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('jwt_secret'),
        signOptions: { expiresIn: config.get<string>('jwt_expires_in') + 's' },
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService
  ],
})
export class AuthModule {}