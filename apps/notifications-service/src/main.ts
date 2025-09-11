import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = Number(process.env.PORT) || 3004;

  // Criar aplicação principal
  const app = await NestFactory.create(AppModule);

  // Conectar microserviço TCP para API Gateway
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: port,
    },
  });

  // Conectar RabbitMQ para consumir eventos de tasks
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

  // Configurar CORS para WebSocket
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Iniciar todos os microserviços
  await app.startAllMicroservices();

  // Iniciar servidor HTTP (para WebSocket)
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
