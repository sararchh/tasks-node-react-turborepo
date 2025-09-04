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
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'task_events',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  publishTaskEvent(event: TaskEvent) {
    return this.client.emit('task.event', event);
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
