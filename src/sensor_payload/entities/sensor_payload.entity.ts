import { MODEENUM } from "src/enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum SensorPayloadColumns {
    id = 'id',
    serial_number = 'serial_number',
    timestamp = 'timestamp',
    mode = 'mode',
    temperature = 'temperature',
    humidity = 'humidity',
    pressure = 'pressure',
    locationLat = 'locationLat',
    locationLng = 'locationLng',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt'
}

@Entity({
    name : 'sensor_payload',
    comment : '센서에 수신받은 데이터'
})
export class SensorPayloadEntity {
    @PrimaryGeneratedColumn('increment', {type : 'int', comment : '센서 데이터 ID'})
    id : number;

    @Column({type : 'varchar', nullable : false, comment : '센서의 시리얼 번호'})
    serial_number : string;

    @Column({ type: 'timestamp with time zone', nullable: false, comment: '센서 기준 데이터 생성 시간' })
    timestamp: Date;

    @Column({type : 'enum', enum : MODEENUM, nullable : false, comment : '센서 작동 모드'})
    mode : MODEENUM;

    @Column({type : 'double precision', nullable : true, comment : '온도'})
    temperature : number | null;

    @Column({type : 'double precision', nullable : true, comment : '습도'})
    humidity : number | null;

    @Column({type : 'double precision', nullable : true, comment : '기압'})
    pressure : number | null;

    @Column({type : 'double precision', nullable : true, comment : '위도'})
    locationLat : number | null;

    @Column({type : 'double precision', nullable : true, comment : '경도'})
    locationLng : number | null;

    @Column({type : 'int', nullable : true, comment : '공기질 지수'})
    airQuality : number | null;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        comment: '레코드 생성 날짜',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        comment: '레코드 업데이트 날짜',
    })
    updatedAt: Date;
}
