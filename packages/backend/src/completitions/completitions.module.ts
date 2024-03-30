import { Module } from '@nestjs/common';
import { CompletitionsService } from './completitions.service';
import { CompletitionsController } from './completitions.controller';

@Module({
  controllers: [CompletitionsController],
  providers: [CompletitionsService],
})
export class CompletitionsModule {}
