import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.schema';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { ObjectId } from 'mongodb';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    currentTask: JwtPayload,
  ): Promise<Task> {
    try {
      return await this.tasksRepository.createOne({
        ...createTaskDto,
        createdBy: currentTask.sub,
        assignedTo: null,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findTaskById(id: string): Promise<Task> {
    try {
      if (!ObjectId.isValid(id))
        throw new BadRequestException('id is not valid!');

      const foundTask = await this.tasksRepository.findOne(
        {
          _id: new ObjectId(id),
        },
        {},
        {
          path: 'createdBy',
          select: { password: 0, createdAt: 0, updatedAt: 0 },
        },
      );

      return foundTask;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
