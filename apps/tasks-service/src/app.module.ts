import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { EventService } from './services/event.service';
import { Task } from './entities/task.entity';
import { TaskComment } from './entities/task-comment.entity';
import { TaskHistory } from './entities/task-history.entity';
import { TaskAssignment } from './entities/task-assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'challenge_db',
      entities: [Task, TaskComment, TaskHistory, TaskAssignment],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([Task, TaskComment, TaskHistory, TaskAssignment]),
  ],
  controllers: [AppController, TasksController],
  providers: [AppService, TasksService, EventService],
})
export class AppModule {}
