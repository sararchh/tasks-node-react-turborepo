import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskComment } from '../entities/task-comment.entity';
import {
  TaskHistory,
  TaskHistoryAction,
} from '../entities/task-history.entity';
import { TaskAssignment } from '../entities/task-assignment.entity';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from '../dto/task.dto';
import { TaskResponseDto, PaginatedTaskResponseDto } from '../dto/response.dto';
import {
  CreateCommentDto,
  CommentQueryDto,
  CommentResponseDto,
  PaginatedCommentResponseDto,
} from '../dto/comment.dto';
import { EventService } from './event.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskComment)
    private commentRepository: Repository<TaskComment>,
    @InjectRepository(TaskHistory)
    private historyRepository: Repository<TaskHistory>,
    @InjectRepository(TaskAssignment)
    private assignmentRepository: Repository<TaskAssignment>,
    private readonly eventService: EventService,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
    userName: string,
  ): Promise<TaskResponseDto> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      createdBy: userId,
      deadline: createTaskDto.deadline
        ? new Date(createTaskDto.deadline)
        : null,
    });

    const savedTask = await this.taskRepository.save(task);

    await this.createHistoryEntry(
      savedTask.id,
      TaskHistoryAction.CREATED,
      `Task created: ${savedTask.title}`,
      {},
      {
        title: savedTask.title,
        description: savedTask.description,
        priority: savedTask.priority,
        status: savedTask.status,
      },
      userId,
      userName,
    );

    if (createTaskDto.assignedUserIds?.length > 0) {
      let userIdToNameMap: Map<string, string> | undefined;

      if (createTaskDto.assignedUsers?.length > 0) {
        userIdToNameMap = new Map();
        createTaskDto.assignedUsers.forEach((user) => {
          userIdToNameMap.set(user.id, user.username);
        });
      }

      await this.assignUsersToTask(
        savedTask.id,
        createTaskDto.assignedUserIds,
        userId,
        userIdToNameMap,
      );
    }

    this.eventService.publishTaskEvent({
      eventType: 'task.created',
      taskId: savedTask.id,
      userId,
      data: {
        title: savedTask.title,
        description: savedTask.description,
        priority: savedTask.priority,
        status: savedTask.status,
        deadline: savedTask.deadline,
        assignedUserIds: createTaskDto.assignedUserIds || [],
      },
      timestamp: new Date(),
    });

    return this.findOne(savedTask.id);
  }

  async findAll(query: TaskQueryDto): Promise<PaginatedTaskResponseDto> {
    const { page = 1, size = 10, status, priority, assignedTo, search } = query;
    const skip = (page - 1) * size;

    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('task.comments', 'comments')
      .orderBy('task.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('task.priority = :priority', { priority });
    }

    if (assignedTo) {
      queryBuilder.andWhere('assignments.userId = :assignedTo', { assignedTo });
    }

    if (search) {
      queryBuilder.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [tasks, total] = await queryBuilder
      .skip(skip)
      .take(size)
      .getManyAndCount();

    const taskDtos = tasks.map((task) => this.mapTaskToDto(task));

    return {
      data: taskDtos,
      meta: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    };
  }

  async findOne(id: string): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignments', 'comments', 'history'],
      order: {
        comments: { createdAt: 'ASC' },
        history: { createdAt: 'DESC' },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.mapTaskToDto(task);
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
    userName: string,
  ): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignments'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const previousValues = {
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority,
      status: task.status,
    };

    const updatedFields: any = {};
    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
      updatedFields.title = updateTaskDto.title;
    }
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
      updatedFields.description = updateTaskDto.description;
    }
    if (updateTaskDto.deadline !== undefined) {
      task.deadline = updateTaskDto.deadline
        ? new Date(updateTaskDto.deadline)
        : null;
      updatedFields.deadline = task.deadline;
    }
    if (updateTaskDto.priority !== undefined) {
      task.priority = updateTaskDto.priority;
      updatedFields.priority = updateTaskDto.priority;
    }
    if (updateTaskDto.status !== undefined) {
      task.status = updateTaskDto.status;
      updatedFields.status = updateTaskDto.status;
    }

    await this.taskRepository.save(task);

    let historyAction = TaskHistoryAction.UPDATED;
    let historyDescription = 'Task updated';

    if (
      updateTaskDto.status &&
      updateTaskDto.status !== previousValues.status
    ) {
      historyAction = TaskHistoryAction.STATUS_CHANGED;
      historyDescription = `Status changed from ${previousValues.status} to ${updateTaskDto.status}`;
    } else if (
      updateTaskDto.priority &&
      updateTaskDto.priority !== previousValues.priority
    ) {
      historyAction = TaskHistoryAction.PRIORITY_CHANGED;
      historyDescription = `Priority changed from ${previousValues.priority} to ${updateTaskDto.priority}`;
    }

    await this.createHistoryEntry(
      id,
      historyAction,
      historyDescription,
      previousValues,
      updatedFields,
      userId,
      userName,
    );

    if (updateTaskDto.assignedUserIds !== undefined) {
      let userIdToNameMap: Map<string, string> | undefined;

      if (updateTaskDto.assignedUsers?.length > 0) {
        userIdToNameMap = new Map();
        updateTaskDto.assignedUsers.forEach((user) => {
          userIdToNameMap.set(user.id, user.username);
        });
      }

      await this.updateTaskAssignments(
        id,
        updateTaskDto.assignedUserIds,
        userId,
        userIdToNameMap,
      );
    }

    this.eventService.publishTaskEvent({
      eventType: 'task.updated',
      taskId: id,
      userId,
      data: {
        updatedFields,
        previousValues,
        updatedAt: new Date(),
      },
      timestamp: new Date(),
    });

    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (task.createdBy !== userId) {
      throw new ForbiddenException('You can only delete tasks you created');
    }

    await this.taskRepository.remove(task);
  }

  async addComment(
    taskId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
    userName: string,
  ): Promise<CommentResponseDto> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      taskId,
      authorId: userId,
      authorName: userName,
    });

    const savedComment = await this.commentRepository.save(comment);

    await this.createHistoryEntry(
      taskId,
      TaskHistoryAction.COMMENT_ADDED,
      `Comment added by ${userName}`,
      {},
      { comment: createCommentDto.content },
      userId,
      userName,
    );

    this.eventService.publishTaskEvent({
      eventType: 'task.commented',
      taskId: taskId,
      userId,
      data: {
        commentId: savedComment.id,
        content: savedComment.content,
        authorName: userName,
        createdAt: savedComment.createdAt,
      },
      timestamp: new Date(),
    });

    return {
      id: savedComment.id,
      content: savedComment.content,
      authorId: savedComment.authorId,
      authorName: savedComment.authorName,
      taskId: savedComment.taskId,
      createdAt: savedComment.createdAt,
    };
  }

  async getTaskComments(
    taskId: string,
    query: CommentQueryDto,
  ): Promise<PaginatedCommentResponseDto> {
    const { page = 1, size = 10 } = query;
    const skip = (page - 1) * size;

    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { taskId },
      order: { createdAt: 'DESC' },
      skip,
      take: size,
    });

    const commentDtos = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      authorName: comment.authorName,
      taskId: comment.taskId,
      createdAt: comment.createdAt,
    }));

    return {
      data: commentDtos,
      meta: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    };
  }

  private async assignUsersToTask(
    taskId: string,
    userIds: string[],
    assignedBy: string,
    userIdToNameMap?: Map<string, string>,
  ): Promise<void> {
    const assignments = userIds.map((userId) =>
      this.assignmentRepository.create({
        taskId,
        userId,
        userName: userIdToNameMap?.get(userId) || `User ${userId}`,
        assignedBy,
      }),
    );

    await this.assignmentRepository.save(assignments);
  }

  private async updateTaskAssignments(
    taskId: string,
    newUserIds: string[],
    updatedBy: string,
    userIdToNameMap?: Map<string, string>,
  ): Promise<void> {
    await this.assignmentRepository.delete({ taskId });

    if (newUserIds.length > 0) {
      await this.assignUsersToTask(
        taskId,
        newUserIds,
        updatedBy,
        userIdToNameMap,
      );
    }
  }

  private async createHistoryEntry(
    taskId: string,
    action: TaskHistoryAction,
    description: string,
    previousValues: Record<string, any>,
    newValues: Record<string, any>,
    changedBy: string,
    changedByName: string,
  ): Promise<void> {
    const historyEntry = this.historyRepository.create({
      taskId,
      action,
      description,
      previousValues,
      newValues,
      changedBy,
      changedByName,
    });

    await this.historyRepository.save(historyEntry);
  }

  private mapTaskToDto(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority,
      status: task.status,
      createdBy: task.createdBy,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      assignments:
        task.assignments?.map((assignment) => ({
          id: assignment.id,
          userId: assignment.userId,
          userName: assignment.userName,
          assignedBy: assignment.assignedBy,
          assignedAt: assignment.assignedAt,
        })) || [],
      comments:
        task.comments?.map((comment) => ({
          id: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          authorName: comment.authorName,
          taskId: comment.taskId,
          createdAt: comment.createdAt,
        })) || [],
      history:
        task.history?.map((history) => ({
          id: history.id,
          action: history.action,
          description: history.description,
          previousValues: history.previousValues,
          newValues: history.newValues,
          changedBy: history.changedBy,
          changedByName: history.changedByName,
          createdAt: history.createdAt,
        })) || [],
    };
  }
}
