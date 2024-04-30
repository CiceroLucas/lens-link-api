import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/post/post.entity';
import { Comment } from './comment.entity';
import { User } from '../users/user.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(data: CreateCommentDto, user: User, post: Post, postId: number) {
    const { content } = data;

    const comment = new Comment();

    comment.content = content;
    comment.user = user;
    comment.post = post;
    comment.postId = postId;

    return this.commentRepository.save(comment);
  }

  async findCommentsByPostId(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { post: { id: postId } },
    });
  }

  async update(id: number, data: UpdateCommentDto, user: User) {
    const { content } = data;

    const comment = await this.commentRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    comment.content = content;

    return this.commentRepository.save(comment);
  }

  async destroy(id: number, user: User) {
    const commet = await this.commentRepository.delete({ id, user });

    if (!commet) {
      throw new NotFoundException('Comment not found.');
    }

    return commet;
  }
}
