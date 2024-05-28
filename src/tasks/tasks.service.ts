import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './models/task.schema';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { ObjectId } from 'mongodb';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryDto } from './dto/query.dto';
import { TaskStatus } from './enum/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly usersService: UsersService,
  ) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    currentUser: JwtPayload,
  ): Promise<Task> {
    try {
      return await this.tasksRepository.createOne({
        ...createTaskDto,
        createdBy: currentUser.sub,
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
        [
          {
            path: 'createdBy',
            select: { password: 0, createdAt: 0, updatedAt: 0 },
          },
          {
            path: 'assignedTo',
            select: { password: 0, createdAt: 0, updatedAt: 0 },
            populate: {
              path: 'assignedTasks',
              model: Task.name,
            },
          },
          {
            path: 'comments.user',
            select: { createdAt: 0, updatedAt: 0, password: 0 },
          },
        ],
      );

      if (!foundTask)
        throw new NotFoundException(`Task with id ${id} not found!`);

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

      return await Promise.all(promiseArr);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updateTask(taskId: string, updateTaskDto: UpdateTaskDto) {
    try {
      if (!ObjectId.isValid(taskId))
        throw new BadRequestException('Id not valid!');

      const result = await this.tasksRepository.updateOne(
        { _id: new ObjectId(taskId) },
        {
          ...updateTaskDto,
          ...(updateTaskDto.status === TaskStatus.COMPLETED && {
            completedAt: new Date(),
          }),
        },
      );

      if (result.modifiedCount === 0) {
        throw new NotFoundException(`Task with id ${taskId} not found!`);
      }

      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async deleteTask(taskId: string) {
    try {
      if (!ObjectId.isValid(taskId))
        throw new BadRequestException('Id not valid!');

      const foundTask = await this.tasksRepository.findOne({
        _id: new ObjectId(taskId),
      });

      if (!foundTask)
        throw new NotFoundException(`Task with id ${taskId} not found!`);

      await this.usersService.unassignTaskFromUser(
        taskId,
        foundTask.assignedTo.toString(),
      );

      return this.tasksRepository.deleteOne({ _id: new ObjectId(taskId) });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getTasks(queryDto: QueryDto) {
    try {
      return this.tasksRepository.findAll(
        {
          ...(queryDto.user && { assignedTo: new ObjectId(queryDto.user) }),
          ...(queryDto.status && { status: queryDto.status }),
          ...(queryDto.dateCreated && {
            createdAt: {
              $gte: new Date(queryDto.dateCreated).setUTCHours(0, 0, 0, 0),
              $lt: new Date(queryDto.dateCreated).setUTCHours(23, 59, 59, 999),
            },
          }),
          ...(queryDto.dateUpdated && {
            updatedAt: {
              $gte: new Date(queryDto.dateUpdated).setUTCHours(0, 0, 0, 0),
              $lt: new Date(queryDto.dateUpdated).setUTCHours(23, 59, 59, 999),
            },
          }),
          ...(queryDto.search && {
            title: { $regex: '.*' + queryDto.search + '.*', $options: 'i' },
          }),
        },
        {},
        {
          queryDto,
          populate: [
            {
              path: 'assignedTo',
              select: { createdAt: 0, updatedAt: 0, password: 0 },
            },
            {
              path: 'comments.user',
              select: { createdAt: 0, updatedAt: 0, password: 0 },
            },
          ],
        },
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async addCommentToTask(
    taskId: string,
    text: string,
    currentUser: JwtPayload,
  ) {
    try {
      if (!ObjectId.isValid(taskId))
        throw new BadRequestException('Id not valid!');

      const updatedTaskResult = await this.tasksRepository.updateOne(
        {
          _id: new ObjectId(taskId),
        },
        { $push: { comments: { text, user: currentUser.sub } } },
      );
      return updatedTaskResult;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getCompletedMonthlyTasksStats(currentUser: JwtPayload) {
    try {
      const dateNow = new Date();

      const dateOneYearAgo = new Date();
      dateOneYearAgo.setFullYear(dateNow.getFullYear() - 1);

      return await this.tasksRepository.getAggregation([
        {
          $match: {
            assignedTo: new ObjectId(currentUser.sub),
            status: TaskStatus.COMPLETED,
            completedAt: {
              $gte: dateOneYearAgo,
            },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: '$completedAt' },
              year: { $year: '$completedAt' },
            },
            count: {
              $count: {},
            },
          },
        },
        {
          $project: {
            _id: 0,
            year: '$_id.year',
            month: '$_id.month',
            count: 1,
          },
        },
      ]);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
