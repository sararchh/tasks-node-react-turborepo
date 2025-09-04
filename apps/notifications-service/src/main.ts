import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = Number(process.env.PORT) || 3004;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: port,
      },
    },
  );

  await app.listen();

  console.log(`🚀 notifications-service TCP is running on: 127.0.0.1:${port}`);
}
bootstrap();
