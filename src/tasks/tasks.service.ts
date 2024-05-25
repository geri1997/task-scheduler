import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.schema';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { ObjectId } from 'mongodb';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly usersService: UsersService,
  ) {}

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
      if (!ObjectId.isValid(id)) throw new BadRequestException('Id not valid!');

      const foundTask = await this.tasksRepository.findOne(
        {
          _id: new ObjectId(id),
        },
        {},
        {
          path: 'createdBy',
          select: { password: 0, createdAt: 0, updatedAt: 0 },
          populate: {
            path: 'assignedTasks',
            model: Task.name,
          },
        },
      );

      return foundTask;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async assignTaskToUser(assignTaskDto: AssignTaskDto) {
    try {
      const { taskId, userId } = assignTaskDto;
      if (!ObjectId.isValid(taskId) || !ObjectId.isValid(userId))
        throw new BadRequestException('Id not valid!');

      const previouslyAssignedTo = await this.usersService.findUserByTaskId(
        taskId,
      );

      if (previouslyAssignedTo) {
        await this.usersService.unassignTaskFromUser(
          taskId,
          previouslyAssignedTo._id.toString(),
        );
      }

      const updatedTask = this.tasksRepository.updateOne(
        {
          _id: new ObjectId(taskId),
        },
        { assignedTo: userId },
      );

      const assignedUser = this.usersService.assignTaskToUser(taskId, userId);
      const promiseArr = [updatedTask, assignedUser];

      await Promise.all(promiseArr);
      return { success: true };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updateTask(taskId: string, updateTaskDto: UpdateTaskDto) {
    try {
      if (!ObjectId.isValid(taskId))
        throw new BadRequestException('Id not valid!');

      return this.tasksRepository.updateOne(
        { _id: new ObjectId(taskId) },
        updateTaskDto,
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async deleteTask(taskId: string) {
    try {
      if (!ObjectId.isValid(taskId))
        throw new BadRequestException('Id not valid!');

      return this.tasksRepository.deleteOne({ _id: new ObjectId(taskId) });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
