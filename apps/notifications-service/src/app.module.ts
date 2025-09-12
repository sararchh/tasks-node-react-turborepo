import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Notification } from './entities/notification.entity';
import { NotificationsController } from './controllers/notifications.controller';
import { EventController } from './controllers/event.controller';
import { NotificationsService } from './services/notifications.service';
import { NotificationsGateway } from './gateways/notifications.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'challenge_db',
      entities: [Notification],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [AppController, NotificationsController, EventController],
  providers: [AppService, NotificationsService, NotificationsGateway],
})
export class AppModule {}
