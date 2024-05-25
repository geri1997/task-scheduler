import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions, UpdateQuery } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createOne(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOne(
    filterQuery: FilterQuery<User>,
    projection: { [key in keyof User]?: 0 | 1 } = {},
    populate?: PopulateOptions,
  ) {
    try {
      return await this.userModel.findOne(filterQuery, projection, {
        populate,
      });
    } catch (error) {
      throw new BadRequestException('Something went wrong when finding user!');
    }
  }

  async updateOne(
    filterQuery: FilterQuery<User>,
    updateQuery: UpdateQuery<User>,
  ) {
    try {
      return this.userModel.updateOne(filterQuery, updateQuery);
    } catch (error) {
      throw new BadRequestException('Something went wrong when updating user!');
    }
  }
}
