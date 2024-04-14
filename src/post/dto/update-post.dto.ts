import { IsNotEmpty } from 'class-validator';

export class updatePostDto {
  @IsNotEmpty()
  description: string;
}
