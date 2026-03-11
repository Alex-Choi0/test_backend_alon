import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({
    summary: '개발자 문서로 리다이렉트 한다.',
    description: '아론의 백엔드 코딩과제의 개발자 문서(Google 문서)로 이동한다.'
  })
  redirect(@Res() res: Response) {
    return res.redirect('https://docs.google.com/document/d/1cLCWiyr29opcE1YZENhP0E3IZSs50d1uHPjERNZptM8/edit?usp=sharing');
  }
}
