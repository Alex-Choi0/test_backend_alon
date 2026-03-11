import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { NoticEmailService } from './notic_email.service';
import { ServerErrorService } from 'src/server_error/server_error.service';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateOneNoticEmailDto } from './dto/create-one-notic_email.dto';
import { UpdateOneNoticEmailDto } from './dto/update-one-notic_email.dto';
import { AVAILABLE_SELECT, OrderEnum } from 'src/enum';
import { NoticEmailColumns } from './entities/notic_email.entity';

@ApiTags('알람 이메일 API')
@Controller('notic-email')
export class NoticEmailController {
  constructor(
    @Inject(NoticEmailService)
    private readonly noticEmailService: NoticEmailService,

    @Inject(ServerErrorService)
    private readonly serverErrorService: ServerErrorService
  ) { }

  private errorLocation = 'NoticEmailController';

  @Post('22/create/one')
  @ApiOperation({
    summary: '센서의 알림을 전달받아야 하는 유저(Email)를 생성한다. #22',
    description: '센서의 상태 변경 또는 오작동의 알림을 메일로 전달받을 사람을 생성한다.'
  })
  @ApiOkResponse({
    description: `정상적으로 응답시 \n
    {
      "id": 고유ID,
      "email": 알림용 Email,
      "name": 유저 이름,
      "mobile": 유저 전화번호,
      "available": 알림 가능유무,
      "createdAt": 레코드 생성 시간,
      "updatedAt": "레코드 업데이트 시간
    }
    `,
    schema: {
      example: {
        "id": 1,
        "email": "choijeaho86@gmail.com",
        "name": "Alex",
        "mobile": "01012345678",
        "available": true,
        "createdAt": "2026-03-11T01:48:48.012Z",
        "updatedAt": "2026-03-11T01:48:48.012Z"
      }
    }
  })
  async createOne(@Body() dto: CreateOneNoticEmailDto) {
    try {

      return await this.noticEmailService.createOne(dto);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode'])
    }
  }

  @Patch('23/update/one/id/:id')
  @ApiOperation({
    summary: '한명의 유저를 수정한다. #23',
    description: '한명의 유저를 ID로 수정한다.'
  })
  @ApiParam({
    name: 'id',
    description: '수정할 유저ID',
    example: 1,
    required: true
  })
  async updateOneById(@Param('id') id: number, @Body() dto: UpdateOneNoticEmailDto) {
    try {

      return await this.noticEmailService.updateOneById(id, dto);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  @Patch('23/update/one/email/:email')
  @ApiOperation({
    summary: '한명의 유저를 수정한다. #23',
    description: '한명의 유저를 email로 수정한다.'
  })
  @ApiParam({
    name: 'email',
    description: '수정할 유저 Email',
    example: 'alex@gmail.com',
    required: true
  })
  async updateOneByEmail(@Param('email') email: string, @Body() dto: UpdateOneNoticEmailDto) {
    try {

      return await this.noticEmailService.updateOneByEmail(email, dto);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  @Get('25/find/many/:keyword/:skip/:take/:availableType/:order/:orderColumn')
  @ApiOperation({
    summary: '알림이 가야하는 유저를 조건에 따라 조회 #25',
    description: '알림이 가아하는 유저를 조회한다.'
  })
  @ApiParam({
    name: 'keyword',
    description: '키워드로 조회한다. 유저의 이름, 이메일, 전화번호를 OR조건으로 조회. 없을시 "-"입력.',
    example: 'choijeaho',
    required: true
  })
  @ApiParam({
    type: Number,
    name: 'skip',
    description: '건너띌 record. 0이면 처음 조회값으로 시작',
    example: 0,
    required: true
  })
  @ApiParam({
    type: Number,
    name: 'take',
    description: '불러올 record. 5이면 skip을 제와한 다음의 조회값 5개를 불러온다.',
    example: 5,
    required: true
  })
  @ApiParam({
    enum: AVAILABLE_SELECT,
    name: 'availableType',
    description: '알람 전송 유무를 입력한다. 전체로 요청시 available와 상관없이 전체 보냄',
    example: AVAILABLE_SELECT.전체,
    required: true
  })
  @ApiParam({
    enum: OrderEnum,
    name: 'order',
    description: '정렬방법. DESC : 내림차순, ASC : 오름차순',
    example: OrderEnum.DESC,
    required: true
  })
  @ApiParam({
    enum: NoticEmailColumns,
    name: 'orderColumn',
    description: '정렬할 컬럼',
    example: NoticEmailColumns,
    required: true
  })
  @ApiOkResponse({
    description: `정상적으로 응답시 \n
    [
      [
        {
          "id": 유저ID,
          "email": 유저이메일,
          "name": 유저이름,
          "mobile": 유저 모바일,
          "available": 알림 가능여부(true일시 알림이 전송),
          "createdAt": 서버에서 생성한 레코드 시간,
          "updatedAt": 서버에서 업데이트한 레코드 시간
        }
      ],
      해당 조건으로 조회시 총 레코드 갯수
    ]
    `,
    schema: {
      example: [
        [
          {
            "id": 1,
            "email": "choijeaho86@gmail.com",
            "name": "Alex",
            "mobile": "01012345678",
            "available": true,
            "createdAt": "2026-03-11T03:25:54.049Z",
            "updatedAt": "2026-03-11T03:25:54.049Z"
          }
        ],
        1
      ]
    }
  })
  async findMany(
    @Param('keyword') keyword: string,
    @Param('skip') skip: number,
    @Param('take') take: number,
    @Param('availableType') availableType: AVAILABLE_SELECT,
    @Param('order') order: OrderEnum,
    @Param('orderColumn') orderColumn: NoticEmailColumns,
  ) {
    try {

      return await this.noticEmailService.findManyOptions(keyword, skip, take, availableType, order, orderColumn);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  @Get('26/find/one/email/:email')
  @ApiOperation({
    summary: '한명의 유저이메일에 대해서 조회한다. #26',
    description: '한명의 유저를 조회하고 존재유무를 확인'
  })
  @ApiParam({
    name: 'email',
    description: '유저의 이메일로 조회',
    type: String,
    example: 'choijeaho86@gmail.com',
    required: true
  })
  @ApiOkResponse({
    description: `정상적으로 응답시\n
    {
      "id": 유저ID,
      "email": 유저이메일,
      "name": 유저이름,
      "mobile": 유저 모바일,
      "available": 알림 가능여부(true일시 알림이 전송),
      "createdAt": 서버에서 생성한 레코드 시간,
      "updatedAt": 서버에서 업데이트한 레코드 시간
    }
    `,
    schema: {
      example: {
        "id": 1,
        "email": "choijeaho86@gmail.com",
        "name": "Alex",
        "mobile": "01012345678",
        "available": true,
        "createdAt": "2026-03-11T03:25:54.049Z",
        "updatedAt": "2026-03-11T03:25:54.049Z"
      }
    }
  })
  async findOneByEmail(@Param('email') email: string) {
    try {

      return await this.noticEmailService.findOneByEmail(email);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  @Get('26/find/one/id/:id')
  @ApiOperation({
    summary: '한명의 유저ID에 대해서 조회한다. #26',
    description: '한명의 유저를 조회하고 존재유무를 확인'
  })
  @ApiParam({
    name: 'id',
    description: '유저의 ID로 조회',
    example: 1,
    type: Number,
    required: true
  })
  @ApiOkResponse({
    description: `정상적으로 응답시\n
    {
      "id": 유저ID,
      "email": 유저이메일,
      "name": 유저이름,
      "mobile": 유저 모바일,
      "available": 알림 가능여부(true일시 알림이 전송),
      "createdAt": 서버에서 생성한 레코드 시간,
      "updatedAt": 서버에서 업데이트한 레코드 시간
    }
    `,
    schema: {
      example: {
        "id": 1,
        "email": "choijeaho86@gmail.com",
        "name": "Alex",
        "mobile": "01012345678",
        "available": true,
        "createdAt": "2026-03-11T03:25:54.049Z",
        "updatedAt": "2026-03-11T03:25:54.049Z"
      }
    }
  })
  async findOneById(@Param('id') id: number) {
    try {

      return await this.noticEmailService.findOneById(id);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }
  }

  @Delete('27/delete/one/:id')
  @ApiOperation({
    summary: '하나의 유저를 삭제한다. #27',
    description: '하나의 유저를 ID로 삭제한다.'
  })
  @ApiParam({
    name: 'id',
    description: '삭제할 유저ID',
    example: 2,
    required: true
  })
  async deleteOneById(@Param('id') id: number) {
    try {

      return await this.noticEmailService.deleteOneById(id);

    } catch (err) {
      await this.serverErrorService.getErrorCode(this.errorLocation, err['message'], err['statusCode']);
    }

  }


}
