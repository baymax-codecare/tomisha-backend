import { Controller, Post, Body, Req, Get, Query, Param, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto, FindJobsDto } from './dto';
import { Job } from './job.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  public find(@Query() findJobsDto: FindJobsDto) {
    return this.jobService.find(findJobsDto);
  }

  @Get(':slug')
  public findOne(@Param('slug') slug: string): Promise<Job> {
    return this.jobService.findOne(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  public create(@Body() createJobDto: CreateJobDto, @Req() req): Promise<Job> {
    return this.jobService.create(createJobDto, req.user);
  }
}
