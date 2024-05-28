import { Test, TestingModule,  } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { JwtPayload } from '../shared/interfaces/jwt-payload.interface';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './enum/task-status.enum';
import { TaskType } from './enum/task-type.enum';
import { Task } from './models/task.schema';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { HttpException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

describe('TasksService', () => {
  let tasksService: TasksService;

  let moduleRef: TestingModule;

  const mockTaskId = '6651df68bfaa77a58806deb5';

  const nonExistingTaskId = '6651dc68bfaa77a58806deb5';

  const mockTasksRepository = {
    createOne: jest.fn((task) => {
      return {
        ...task,
        _id: mockTaskId,
        status: TaskStatus.BACKLOG,
        createdBy: mockUser.sub,
        comments: [],
        completedAt: null,
      };
    }),
    findOne: jest.fn((query) => {
      if (query._id.toString() === mockTaskId) {
        const newTask = new Task();
        newTask.assignedTo = mockUser.sub;
        return newTask;
      }

      return null;
    }),
    updateOne: jest.fn((query, updateDto) => {
      if (query._id.toString() === mockTaskId) {
        return { modifiedCount: 1 };
      }

      return { modifiedCount: 0 };
    }),
    deleteOne: jest.fn((query) => {}),
  };

  const mockUserService = {
    unassignTaskFromUser: jest.fn((taskId, userId) => {}),
  };

  const mockUser: JwtPayload = {
    sub: '6651f57d50d91165c7cefd5f',
    firstName: 'Geri',
    lastName: 'Luga',
    email: 'luga.geri@gmail.com',
  };

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
      providers: [TasksService, TasksRepository, UsersService],
    })
      .overrideProvider(TasksRepository)
      .useValue(mockTasksRepository)
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    tasksService = moduleRef.get<TasksService>(TasksService);
  });

  describe('createTask', () => {
    it('should create and return a task', async () => {
      const mockCreateTaskDto: CreateTaskDto = {
        title: 'test title',
        description: 'test description',
        type: TaskType.CONTENT,
      };

      const expectedCreatedTask = {
        ...mockCreateTaskDto,
        status: TaskStatus.BACKLOG,
        createdBy: mockUser.sub,
        comments: [],
        completedAt: null,
        _id: mockTaskId,
      };

      const result = await tasksService.createTask(mockCreateTaskDto, mockUser);

      expect(result).toStrictEqual(expectedCreatedTask);
    });
  });

  describe('findTaskById', () => {
    it('should throw on invalid mongoId', async () => {
      await expect(tasksService.findTaskById('1231231')).rejects.toThrow(
        HttpException,
      );
    });

    it('should find a task by id', async () => {
      const result = await tasksService.findTaskById(mockTaskId);
      expect(result).not.toBeNull();
    });

    it('should not find non existant task', async () => {
      await expect(
        tasksService.findTaskById(nonExistingTaskId),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateTask', () => {
    it('should update task', async () => {
      await tasksService.updateTask(mockTaskId, {
        status: TaskStatus.IN_PROGRESS,
      });

      expect(mockTasksRepository.updateOne).toHaveBeenCalledWith(
        {
          _id: new ObjectId(mockTaskId),
        },
        {
          status: TaskStatus.IN_PROGRESS,
        },
      );
    });

    it('should fail to update if task doesnt exist', async () => {
      await expect(
        tasksService.updateTask('sads123', {
          status: TaskStatus.IN_PROGRESS,
        }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteTask', () => {
    it('should delete task', async () => {
      await tasksService.deleteTask(mockTaskId);

      expect(mockTasksRepository.deleteOne).toHaveBeenCalledWith({
        _id: new ObjectId(mockTaskId),
      });

      expect(mockUserService.unassignTaskFromUser).toHaveBeenCalledWith(
        mockTaskId,
        mockUser.sub,
      );
    });

    it('should fail to delete if task doesnt exist', async () => {
      await expect(tasksService.deleteTask(nonExistingTaskId)).rejects.toThrow(
        HttpException,
      );
    });
  });

  afterEach(() => {
    moduleRef.close();
  });
});
