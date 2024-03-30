import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { CompletitionsService } from './completitions.service';

@Controller('completitions')
export class CompletitionsController {
  constructor(private readonly completitionsService: CompletitionsService) { }

  @Post('generate')
  async completition(@Body('input') input: string) {
    return await this.completitionsService.completition(input.toString());
  }
}
