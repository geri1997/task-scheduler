import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { Task } from './task.schema';

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
      throw new HttpException(
        'Something went wrong when finding task!',
        error.status,
      );
    }
  }
}
