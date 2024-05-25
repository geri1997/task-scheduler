import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { CreateTaskDto } from './dto/create-task.dto';

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
}
