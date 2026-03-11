import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateOneSensorDto {
    @ApiProperty({
        type : String,
        description : '센서의 시리얼 번호',
        example : 'SANSOR-A-1004',
        required : true
    })
    @IsString()
    @IsNotEmpty()
    id : string;

    @ApiProperty({
        type : String,
        description : '센서의 장비 이름',
        example : '온도 입력 모듈',
        required : false
    })
    @IsString()
    @IsOptional()
    name : string | null;

    @ApiProperty({
        type : String,
        description : '장비의 모델',
        example : 'NI-9213',
        required : false
    })
    @IsString()
    @IsOptional()
    model : string | null;

    @ApiProperty({
        type : String,
        description : '장비 제조사',
        example : 'National Instruments(NI)',
        required : false
    })
    @IsString()
    @IsOptional()
    manufacturer : string | null;

}
