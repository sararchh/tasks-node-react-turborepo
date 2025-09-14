import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = Number(process.env.PORT) || 3004;
  const tcpPort = Number(process.env.TCP_PORT) || 3014; // Different port for TCP

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      // host: '127.0.0.1',
      port: tcpPort,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
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

  console.log(`🚀 notifications-service HTTP is running on: 0.0.0.0:${port}`);
  console.log(`🚀 notifications-service TCP is running on: 0.0.0.0:${tcpPort}`);
  console.log(
    `🔌 notifications-service WebSocket is running on: ws://localhost:${port}/notifications`,
  );
  console.log(
    `📥 notifications-service RabbitMQ consumer is listening on: task_events`,
  );
}

bootstrap();
