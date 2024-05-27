import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryDto } from './dto/query.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@ApiTags('tasks')
@UseGuards(JwtAuthGuard)
@ApiResponse({ status: 201, description: 'Successfully Created' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({
    description: 'Endpoint to create a new task.',
  })
  @Post()
  createTask(
    @CurrentUser() currentUser: JwtPayload,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.createTask(createTaskDto, currentUser);
  }

  @ApiOperation({
    description: 'Endpoint to get filtered tasks with pagination.',
  })
  @Get()
  getTasks(@Query() queryDto: QueryDto) {
    return this.tasksService.getTasks(queryDto);
  }

  @ApiOperation({
    description: 'Endpoint to get monthly tasks stats.',
  })
  @Get('/completed-stats-monthly')
  getCompletedMonthlyTaskStats(@CurrentUser() currentUser: JwtPayload) {
    return this.tasksService.getCompletedMonthlyTasksStats(currentUser);
  }

  @ApiOperation({
    description: 'Endpoint to get a single task by id.',
  })
  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.findTaskById(id);
  }

  @ApiOperation({
    description: 'Endpoint to assign a task to a user.',
  })
  @Put('/assign')
  assignTaskToUser(@Body() assignTaskDto: AssignTaskDto) {
    return this.tasksService.assignTaskToUser(assignTaskDto);
  }

  @ApiOperation({
    description: 'Endpoint to add a comment to a task.',
  })
  @Put('/:id/comment')
  addCommentToTask(
    @CurrentUser() currentUser: JwtPayload,
    @Param('id') taskId: string,
    @Body() addCommentDto: AddCommentDto,
  ) {
    return this.tasksService.addCommentToTask(
      taskId,
      addCommentDto.text,
      currentUser,
    );
  }

  @ApiOperation({
    description: 'Endpoint to update a task.',
  })
  @ApiBody({
    description: 'Update task dto',
    type: UpdateTaskDto,
  })
  @Put('/:id')
  updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(taskId, updateTaskDto);
  }

  @ApiOperation({
    description: 'Endpoint to delete a task by id.',
  })
  @Delete('/:id')
  deleteTask(@Param('id') taskId: string) {
    return this.tasksService.deleteTask(taskId);
  }
}
