import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum GoalType { diaria='diaria', semanal='semanal', quinzenal='quinzenal', mensal='mensal', anual='anual' }

export class CreateGoalDto {
  @IsString() @MinLength(2) title: string;
  @IsString() @IsOptional() description?: string;
  @IsEnum(GoalType) type: GoalType;
  @IsDateString() @IsOptional() startDate?: string;
  @IsDateString() @IsOptional() endDate?: string;
}

export class UpdateGoalDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() description?: string;
  @IsEnum(GoalType) @IsOptional() type?: GoalType;
  @IsBoolean() @IsOptional() completed?: boolean;
  @IsDateString() @IsOptional() startDate?: string;
  @IsDateString() @IsOptional() endDate?: string;
}
