import { IsString, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  content: string;
}

export class CommentQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 10;
}

export class CommentResponseDto {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  taskId: string;
  createdAt: Date;
}

export class PaginatedCommentResponseDto {
  data: CommentResponseDto[];
  meta: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}
