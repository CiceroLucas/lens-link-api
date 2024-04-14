import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/user.entity';
import { FileDTO } from './dto/upload-file.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { updatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly supabaseService: SupabaseService,
  ) {}

  async store(data: CreatePostDto, user: User, file: FileDTO) {
    const { description } = data;
    const uploadedImage = await this.supabaseService.upload(file);

    const post: Post = new Post();
    post.description = description;
    post.image = uploadedImage;
    post.user = user;
    post.userId = user.id;

    return this.postsRepository.save(post);
  }

  async findAll() {
    return this.postsRepository
      .find({
        relations: ['user'],
        select: ['image', 'description', 'createdAt', 'likes'],
      })
      .then((posts) =>
        posts.map((post) => ({
          ...post,
          user: {
            profilePic: post.user.profilePic,
            firstName: post.user.firstName,
            lastName: post.user.lastName,
            userId: post.user.id,
          },
        })),
      );
  }

  async update(id: number, data: updatePostDto, user: User) {
    const post = await this.postsRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.description = data.description;

    await this.postsRepository.save(post);

    return post;
  }

  async likePost(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    post.likes += 1;
    return this.postsRepository.save(post);
  }

  async unlikePost(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.likes > 0) {
      post.likes -= 1;
    }
    return this.postsRepository.save(post);
  }

  async destroy(id: number, user: User) {
    const post = await this.postsRepository.delete({ id, user });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
}
