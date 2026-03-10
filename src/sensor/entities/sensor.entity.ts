import { MODEENUM, SENSOR_STATUS_ENUM } from "src/enum";
import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum SensorColumns {
    id = 'id',
    name = 'name',
    model = 'model',
    manufacturer = 'manufacturer',
    lastMode = 'lastMode',
    lastTime = 'lastTime',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt'
}

@Entity({
    name: 'sensor',
    comment: '등록된 센서 Record'
})
export class SensorEntity {
    @PrimaryColumn({ type: 'varchar', nullable: false, comment: '센서 시리얼 번호' })
    id: string;

    @Column({ type: 'varchar', nullable: true, comment: '장비 이름' })
    name: string | null;

    @Column({ type: 'varchar', nullable: true, comment: '장비의 모델' })
    model: string | null;

    @Column({ type: 'varchar', nullable: true, comment: '장비 제조사' })
    manufacturer: string | null;

    @Column({ type: 'enum', enum: MODEENUM, nullable: true, comment: '마지막 모드' })
    lastMode: MODEENUM | null;

    @Column({ type: 'timestamp with time zone', nullable: true, comment: '마지막 센서기준 데이터생성시간(UTC로 통일)' })
    lastTime: Date | null;

    @Column({ type: 'int', nullable: true, comment: '마지막 센서 기록ID' })
    lastSensorPayloadId: number | null

    @Column({ type: 'enum', nullable: false, enum: SENSOR_STATUS_ENUM, default: SENSOR_STATUS_ENUM.NORMAL, comment: '센서의 동작상태' })
    status: SENSOR_STATUS_ENUM;

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
