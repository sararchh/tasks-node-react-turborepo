import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;
}

export class CommentResponseDto {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  taskId: string;
  createdAt: Date;
}
