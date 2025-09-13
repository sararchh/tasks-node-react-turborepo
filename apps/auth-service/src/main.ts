import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = Number(process.env.PORT) || 3002;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        // host: '127.0.0.1',
        port: port,
      },
    },
  );

  await app.listen();

  console.log(`🚀 auth-service TCP is running on: 0.0.0.0:${port}`);
}
bootstrap();
