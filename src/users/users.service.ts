import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import { FilterQuery } from 'mongoose';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';

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

  async findUserByEmail(email: string) {
    return await this.findUser({ email });
  }

  private async findUser(
    filterQuery: FilterQuery<User>,
    projection?: { [key in keyof User]?: 0 | 1 },
  ): Promise<User> {
    const foundUser = await this.usersRepository.findOne(
      filterQuery,
      projection,
    );

    return foundUser;
  }

  async getUserProfile(currentUser: JwtPayload) {
    return await this.findUser({ email: currentUser.email }, { password: 0 });
  }
}
