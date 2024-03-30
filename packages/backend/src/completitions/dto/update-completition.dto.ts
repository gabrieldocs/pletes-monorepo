import { PartialType } from '@nestjs/mapped-types';
import { CreateCompletitionDto } from './create-completition.dto';

export class UpdateCompletitionDto extends PartialType(CreateCompletitionDto) {}
