import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/users/user.entity';
import { Post as Photo } from 'src/post/post.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':postId')
  create(
    @Body() data: CreateCommentDto,
    @Param('postId') postId: number,
    @CurrentUser() user: User,
    post: Photo,
  ) {
    return this.commentService.create(data, user, post, postId);
  }

  @Get('post/:postId')
  async getCommentsByPostId(@Param('postId') postId: number) {
    return this.commentService.findCommentsByPostId(postId);
  }

  @Patch(':commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Body() data: UpdateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentService.update(commentId, data, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @CurrentUser() user: User) {
    return this.commentService.destroy(id, user);
  }
}
