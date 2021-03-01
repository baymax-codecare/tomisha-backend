import { Controller, Get, Req, Param, Post, Body, UseGuards, ParseIntPipe, Res, Query, ParseUUIDPipe } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { CreateInterviewDto, CreateInterviewLogDto, FindInterviewsDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request, Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('interview')
export class InterviewController {
  constructor(private interviewService: InterviewService) {}

  @Get()
  public find(@Query() findInterviewsDto: FindInterviewsDto, @Req() req: Request) {
    return this.interviewService.find(findInterviewsDto, req.user.id);
  }

  @Get('me')
  public findMyInterviews(@Req() req: Request) {
    return this.interviewService.findMyInterviews(req.user.id);
  }

  @Get(':id')
  public findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Query('companyId', ParseUUIDPipe) companyId: string) {
    return this.interviewService.findOne(id, req.user.id, companyId);
  }

  @Post()
  public create(@Body() createInterviewDto: CreateInterviewDto, @Req() req: Request) {
    return this.interviewService.create(createInterviewDto, req.user.id);
  }

  @Post('log')
  public async log(@Body() createAPplicationLogDto: CreateInterviewLogDto, @Req() req: Request, @Res() res: Response) {
    await this.interviewService.createInterviewLog(createAPplicationLogDto, req.user.id);
    res.sendStatus(200);
  }
}
