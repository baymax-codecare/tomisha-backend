import { IsInt, IsString, MaxLength, IsArray, ArrayMinSize, ArrayUnique, Min, Max } from 'class-validator';
import { OccupationSkill } from '../occupation-skill.entity';
import { OccupationPreference } from '../occupation-preference.entity';
import { OccupationExperience } from '../occupation-expereience.entity';

export class CreateOccupationDto {
  @IsInt()
  public professionId: number;

  @IsString()
  @MaxLength(250)
  public skill: string;

  @IsString()
  public skillDescription: string;

  @IsString()
  public shortDescription: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  public relationships: number[];

  @IsInt()
  @Min(0)
  @Max(100)
  public minWorkload: number;

  @IsInt()
  @Min(0)
  @Max(100)
  public maxWorkload: number;

  @IsArray()
  public skills: OccupationSkill[];

  @IsArray()
  public preferences: OccupationPreference[];

  @IsArray()
  public experiences: OccupationExperience[];
}
