import { IsNotEmpty } from 'class-validator';

// create-comment.dto.ts
export class CreateCommentDto {
  @IsNotEmpty()
  content: string;
}
