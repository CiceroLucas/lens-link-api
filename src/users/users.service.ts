import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user';
import { CreateUserDto } from './dto/create-user';
import * as bcrypt from 'bcrypt';
import { FileDTO } from './dto/upload-file';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly supabaseService: SupabaseService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Could not find the user');
    }
    return user;
  }

  // async findOneById(id: string) {
  //   const user = await this.usersRepository.findOneBy({ id });
  //   if (!user) {
  //     throw new NotFoundException('Could not find the user');
  //   }
  //   const { password, createdAt, updatedAt, deletedAt, ...userWithoutPass } =
  //     user;
  //   return userWithoutPass;
  // }

  async findByFirstName(firstName: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: { firstName: ILike(`%${firstName}%`) },
      select: ['id', 'firstName', 'lastName', 'profilePic', 'posts'],
    });
  }

  async store(data: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(data.password, salt);

    data.password = hashPassword;
    data.profilePic = process.env.DEFAULT_IMAGE_PIC;
    const user = this.usersRepository.create(data);

    return this.usersRepository.save(user);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    try {
      const user: User = new User();
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.id = id;

      return await this.usersRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async updateProfilePic(id: string, file: FileDTO) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const uploadedImage = await this.supabaseService.upload(file);
    user.profilePic = uploadedImage;

    return await this.usersRepository.save(user);
  }

  async destroy(id: string) {
    try {
      return await this.usersRepository.delete(id);
    } catch (error) {
      throw new NotFoundException('User not found.');
    }
  }
}
