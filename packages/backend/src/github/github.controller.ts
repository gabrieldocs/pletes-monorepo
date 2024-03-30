import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GithubService } from './github.service';
import { CreateGithubDto } from './dto/create-github.dto';
import { UpdateGithubDto } from './dto/update-github.dto';
import * as path from 'path';


@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) { }

  @Get('ping')
  pong() {
    return { ping: 'pong' };
  }

  @Post("create-repository")
  create_repository(@Body('name') name: string, @Body('description') description: string) {
    return this.githubService.createRepository(name, description)
  }

  @Post('receive-and-push')
  async receiveAndPushCode(@Body() data: { name: string; description: string; rarFilePath: string }): Promise<string> {
    const { name, description, rarFilePath } = data;
    const destinationPath = path.resolve('..', 'tempest', name);
    return await this.githubService.receiveAndPush(name, description, rarFilePath, destinationPath);    
  }

  @Post('receive-and-commit')
  async receiveAndCommit(@Body() data: {directory, path, content, commit_message}): Promise<void> {
    const {path, directory, content, commit_message} = data;
    return this.githubService.writeFileToTheDirectory(path, directory, content, commit_message)
  }

  @Post()
  create(@Body() createGithubDto: CreateGithubDto) {
    return this.githubService.create(createGithubDto);
  }

  @Get()
  findAll() {
    return this.githubService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.githubService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGithubDto: UpdateGithubDto) {
    return this.githubService.update(+id, updateGithubDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.githubService.remove(+id);
  }
}
