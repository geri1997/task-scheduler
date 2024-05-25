import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(
    @CurrentUser() currentUser: JwtPayload,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.createTask(createTaskDto, currentUser);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.findTaskById(id);
  }

  @Put('/assign')
  assignTaskToUser(@Body() assignTaskDto: AssignTaskDto) {
    return this.tasksService.assignTaskToUser(assignTaskDto);
  }

  @Put('/:id/')
  updateTask(
    @Param('id') taskId: string,
    @Body() updateTaskStatusDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(taskId, updateTaskStatusDto);
  }
}
