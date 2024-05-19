import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user';
import { UpdateUserDto } from './dto/update-user';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { FileDTO } from './dto/upload-file';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  index() {
    return this.usersService.findAll();
  }

  @IsPublic()
  @Post()
  store(@Body() body: CreateUserDto) {
    return this.usersService.store(body);
  }

  @Get(':id/profile')
  findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.findOneById(id);
  }

  @Get('search')
  findByFirstName(@Query('name') firstName: string) {
    return this.usersService.findByFirstName(firstName);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }

  @Patch(':id/profile')
  @UseInterceptors(FileInterceptor('profile'))
  updateProfilePic(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: FileDTO,
  ) {
    return this.usersService.updateProfilePic(id, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.destroy(id);
  }
}
