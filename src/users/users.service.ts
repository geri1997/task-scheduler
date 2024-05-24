import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import { FilterQuery } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersRepository.createOne(createUserDto);
    } catch (error) {
      if (error.code === 11000)
        throw new ConflictException(
          `A user with the email ${createUserDto.email} already exists!`,
        );
      throw new BadRequestException(error);
    }
  }

  async findUser(filterQuery: FilterQuery<User>): Promise<User> {
    const foundUser = await this.usersRepository.findOne(filterQuery);

    return foundUser;
  }
}
