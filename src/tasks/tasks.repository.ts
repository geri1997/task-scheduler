import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions, UpdateQuery } from 'mongoose';
import { Task } from './task.schema';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class TasksRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async createOne(task: Partial<Task>): Promise<Task> {
    const createdTask = new this.taskModel(task);
    return createdTask.save();
  }

  async findOne(
    filterQuery: FilterQuery<Task>,
    projection: { [key in keyof Task]?: 0 | 1 } = {},
    populate?: PopulateOptions,
  ) {
    try {
      return await this.taskModel.findOne(filterQuery, projection, {
        populate,
      });
    } catch (error) {
      throw new BadRequestException('Something went wrong when finding task!');
    }
  }

  async updateOne(
    filterQuery: FilterQuery<Task>,
    updateQuery: UpdateQuery<Task>,
  ) {
    try {
      return this.taskModel.updateOne(filterQuery, updateQuery);
    } catch (error) {
      throw new BadRequestException('Something went wrong when updating task!');
    }
  }

  async findAll(
    filterQuery: FilterQuery<Task>,
    projection: { [key in keyof Task]?: 0 | 1 } = {},
    options: {
      queryDto: QueryDto;
      populate?: PopulateOptions;
    },
  ) {
    return this.taskModel
      .find(filterQuery, projection, {
        limit: options.queryDto.size || 10,
        skip: options.queryDto.page - 1 || 0,
        populate: options.populate,
      })
      .sort({
        [options.queryDto.sortBy || 'createdAt']:
          options.queryDto.sort || 'asc',
      });
  }

  async deleteOne(filterQuery: FilterQuery<Task>) {
    try {
      return this.taskModel.deleteOne(filterQuery);
    } catch (error) {
      throw new BadRequestException('Something went wrong when deletig task!');
    }
  }
}
