import { IsString } from 'class-validator';

export class OrthographyDto {
  @IsString()
  readonly prompt: string;
}
