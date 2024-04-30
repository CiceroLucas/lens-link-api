import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDTO } from './dto/upload-file.dto';
import { updatePostDto } from './dto/update-post.dto';

@Controller('v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async index() {
    return this.postService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.postService.findById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() body: CreatePostDto,
    @CurrentUser() user: User,
    @UploadedFile() file: FileDTO,
  ) {
    const result = await this.postService.store(body, user, file);
    return result;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Body() body: updatePostDto,
  ) {
    return this.postService.update(id, body, user);
  }

  @Post(':id/like')
  async likePost(@Param('id') postId: number) {
    return this.postService.likePost(postId);
  }

  @Delete(':id/like')
  async unlikePost(@Param('id') postId: number) {
    return this.postService.unlikePost(postId);
  }

  @Delete(':id')
  async destroy(@Param('id') id: number, @CurrentUser() user: User) {
    return this.postService.destroy(id, user);
  }
}
