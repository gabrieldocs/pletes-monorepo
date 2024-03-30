import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('/folder-structure')
  async folder_structure() {
    return await this.projectsService.folder_structure();
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body('path') userPath: string) {
    return this.projectsService.upload(file, userPath);
  }

  @Post('/store')
  @UseInterceptors(FileInterceptor('file', { dest: './public' }))
  async uploadToLocalStorage(@UploadedFile() file: Express.Multer.File) {
    return this.projectsService.upload_to_local_storage(file);
  }

  @Get('/v1/contents')
  async contents(@Res() res: Response) {
    return this.projectsService.v1_contents(res);
  }

  @Get('/contents')
  async getFileContents(@Query('filePath') filePath: string, @Res() res: Response) {
    return this.projectsService.contents(filePath, res);
  }

  @Post('/write-to-file')
  async writter(@Body() body: { textContent: string }) {
    return this.projectsService.write_to_file(body)
  }

  
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
