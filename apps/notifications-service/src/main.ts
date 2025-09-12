import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = Number(process.env.PORT) || 3004;

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: port,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@localhost:5672'],
      queue: 'task_events',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  await app.startAllMicroservices();

  await app.listen(port);

  console.log(`🚀 notifications-service TCP is running on: 127.0.0.1:${port}`);
  console.log(
    `🔌 notifications-service WebSocket is running on: ws://localhost:${port}/notifications`,
  );
  console.log(
    `📥 notifications-service RabbitMQ consumer is listening on: task_events`,
  );
}

bootstrap();
