import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
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
    return await this.usersRepository.findOne({ email });
  }

  async findUserById(id: string) {
    return await this.usersRepository.findOne({ _id: new ObjectId(id) });
  }

  async getCurrentUserProfile(currentUser: JwtPayload) {
    return await this.usersRepository.findOne(
      { email: currentUser.email },
      { password: 0 },
      {
        path: 'assignedTasks',
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

  async unassignTaskFromUser(taskId: string, userId: string) {
    try {
      return await this.usersRepository.updateOne(
        {
          _id: new ObjectId(userId),
        },
        {
          $pull: { assignedTasks: taskId },
        },
      );
    } catch (error) {
      throw new BadRequestException('Could not unassign task to user!');
    }
  }

  async findUserByTaskId(taskId: string) {
    try {
      return await this.usersRepository.findOne({
        assignedTasks: new ObjectId(taskId),
      });
    } catch (error) {
      throw new BadRequestException(
        'Something went wrong when finding user by task id!',
      );
    }
  }
}
