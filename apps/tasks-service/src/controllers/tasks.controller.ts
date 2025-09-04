import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from '../dto/task.dto';
import { CreateCommentDto } from '../dto/comment.dto';
import { TaskResponseDto, PaginatedTaskResponseDto } from '../dto/response.dto';

interface UserPayload {
  sub: string;
  username?: string;
  email?: string;
}

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('tasks.create')
  async create(
    @Payload() data: { createTaskDto: CreateTaskDto; user: UserPayload },
  ): Promise<TaskResponseDto> {
    const { createTaskDto, user } = data;
    return this.tasksService.create(
      createTaskDto,
      user.sub,
      user.username || user.email || 'Unknown User',
    );
  }

  @MessagePattern('tasks.findAll')
  async findAll(
    @Payload() query: TaskQueryDto,
  ): Promise<PaginatedTaskResponseDto> {
    return this.tasksService.findAll(query);
  }

  @MessagePattern('tasks.findOne')
  async findOne(@Payload() id: string): Promise<TaskResponseDto> {
    return this.tasksService.findOne(id);
  }

  @MessagePattern('tasks.update')
  async update(
    @Payload()
    data: {
      id: string;
      updateTaskDto: UpdateTaskDto;
      user: UserPayload;
    },
  ): Promise<TaskResponseDto> {
    const { id, updateTaskDto, user } = data;
    return this.tasksService.update(
      id,
      updateTaskDto,
      user.sub,
      user.username || user.email || 'Unknown User',
    );
  }

  @MessagePattern('tasks.remove')
  async remove(
    @Payload() data: { id: string; user: UserPayload },
  ): Promise<void> {
    const { id, user } = data;
    return this.tasksService.remove(id, user.sub);
  }

  @MessagePattern('tasks.addComment')
  async addComment(
    @Payload()
    data: {
      taskId: string;
      createCommentDto: CreateCommentDto;
      user: UserPayload;
    },
  ): Promise<TaskResponseDto> {
    const { taskId, createCommentDto, user } = data;
    return this.tasksService.addComment(
      taskId,
      createCommentDto,
      user.sub,
      user.username || user.email || 'Unknown User',
    );
  }
}
