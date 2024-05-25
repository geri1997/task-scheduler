import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import { FilterQuery, PopulateOptions } from 'mongoose';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { ObjectId } from 'mongodb';

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
    populate?: PopulateOptions,
  ): Promise<User> {
    const foundUser = await this.usersRepository.findOne(
      filterQuery,
      projection,
      populate,
    );

    return foundUser;
  }

  async findUserById(id: string) {
    return await this.findUser({ _id: new ObjectId(id) });
  }

  async getCurrentUserProfile(currentUser: JwtPayload) {
    return await this.findUser(
      { email: currentUser.email },
      { password: 0 },
      {
        path: 'assignedTasks',
        populate: {
          path: 'createdBy',
          model: User.name,
          select: { createdAt: 0, updatedAt: 0, password: 0 },
        },
      },
    );
  }

  async assignTaskToUser(taskId: string, userId: string) {
    try {
      return await this.usersRepository.updateOne(
        {
          _id: new ObjectId(userId),
        },
        {
          $push: { assignedTasks: taskId },
        },
      );
    } catch (error) {
      throw new BadRequestException('Could not assign task to user!');
    }
  }
}
