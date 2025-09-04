import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

export interface TaskEvent {
  eventType:
    | 'task.created'
    | 'task.updated'
    | 'task.deleted'
    | 'task.commented';
  taskId: string;
  userId: string;
  data: any;
  timestamp: Date;
}

@Injectable()
export class EventService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@localhost:5672'],
        queue: 'task_events',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  publishTaskEvent(event: TaskEvent) {
    try {
      return this.client.emit(event.eventType, event);
    } catch (error) {
      console.error('❌ Erro ao publicar evento:', error);
    }
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
