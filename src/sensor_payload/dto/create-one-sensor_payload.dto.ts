import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { MODEENUM } from "src/enum";

export class LocationDto {
    @ApiProperty({ example: 37.5665 })
    @IsNumber()
    lat: number;

    @ApiProperty({ example: 126.9780 })
    @IsNumber()
    lng: number;
}

export class CreateOneSensorPayloadDto {
    @ApiProperty({
        type: String,
        description: '센서 시리얼 번호',
        required: true,
        example: 'SANSOR-A-1004'
    })
    @IsString()
    @IsNotEmpty()
    serial_number: string;

    @ApiProperty({
        type: String,
        description: '센서 기준 데이터 생성시간. UTC또는 지역이 포함된 시간',
        required: true,
        example: '2024-05-23T08:30:00+09:00'
    })
    @IsString()
    @IsNotEmpty()
    timestamp: string;

    @ApiProperty({
        enum: MODEENUM,
        description: '작동 모드(NORMAL, EMERGENCY)',
        required: true,
        example: MODEENUM.NORMAL
    })
    @IsEnum(MODEENUM)
    @IsNotEmpty()
    mode: MODEENUM;

    @ApiProperty({
        type: Number,
        description: '센서에서 측정된 온도',
        required: false,
        example: 24.5
    })
    @IsNumber()
    @IsOptional()
    temperature: number | null;

    @ApiProperty({
        type: Number,
        description: '센서에서 측정된 습도',
        required: false,
        example: 50.2
    })
    @IsNumber()
    @IsOptional()
    humidity: number | null;

    @ApiProperty({
        type: Number,
        description: '센서에서 측정된 기압',
        required: false,
        example: 1013.2
    })
    @IsNumber()
    @IsOptional()
    pressure: number | null;

    @ApiProperty({
        type: LocationDto,
        description: '위도(lat), 경도(lng) 정보를 포함한 객체',
        required: false,
        example: {
            "lat": 37.5665,
            "lng": 126.9780
        }
    })
    @IsObject()
    @IsOptional()
    location: LocationDto | null;

    @ApiProperty({
        type: Number,
        description: '센서에서 측정된 공기질 지수',
        required: false,
        example: 42
    })
    @IsInt()
    @IsOptional()
    air_quality: number | null;
}
