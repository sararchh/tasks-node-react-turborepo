import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './app/auth/auth.controller';
import { UsersController } from './app/users/users.controller';
import { TasksController } from './app/tasks/tasks.controller';
import { NotificationsController } from './app/notifications/notifications.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,
          limit: 10,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 20,
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '15m' },
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST || '127.0.0.1',
          port: parseInt(process.env.AUTH_SERVICE_PORT) || 3002,
        },
      },
      {
        name: 'TASKS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.TASKS_SERVICE_HOST || '127.0.0.1',
          port: parseInt(process.env.TASKS_SERVICE_PORT) || 3003,
        },
      },
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTIFICATIONS_SERVICE_HOST || '127.0.0.1',
          port: parseInt(process.env.NOTIFICATIONS_SERVICE_PORT) || 3004,
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    TasksController,
    NotificationsController,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
