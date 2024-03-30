import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ContainersService } from './containers.service';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { Response } from 'express';

@Controller('containers')
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @Post()
  create(@Body() createContainerDto: CreateContainerDto) {
    return this.containersService.create(createContainerDto);
  }

  @Get()
  findAll() {
    console.log(new Date())
    return this.containersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.containersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContainerDto: UpdateContainerDto) {
    return this.containersService.update(+id, updateContainerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.containersService.remove(+id);
  }

  @Post('/build-and-run')
  async buildAndRun() {
    return this.containersService.build_and_run();
  }

  @Post('/build-and-run-sync')
  async buildAndRunSync() {
    return this.containersService.build_and_run_sync();
  }

  /**
   * Retrieves the output of the container execution
   */
  @Get('/retrieve')
  async retrieve() {
    return this.containersService.retrieve();
  }

  @Get('/retrieve-pit')
  async retrievePit() {
    // console.log(new Date().toLocaleDateString())
    return this.containersService.retrieve_pit();
  }
}
