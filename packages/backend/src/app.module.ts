import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompletitionsModule } from './completitions/completitions.module';
import { GithubModule } from './github/github.module';
import { ProjectsModule } from './projects/projects.module';
import { ContainersModule } from './containers/containers.module';

@Module({
  imports: [CompletitionsModule, ConfigModule.forRoot(), ContainersModule, ProjectsModule, GithubModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
