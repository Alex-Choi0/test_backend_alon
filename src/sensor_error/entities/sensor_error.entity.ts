import { MODEENUM } from "src/enum";
import { SensorPayloadEntity } from "src/sensor_payload/entities/sensor_payload.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: 'sensor_error',
  comment: '센서의 에러를 기록한다.'
})
export class SensorErrorEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int', comment: '센서 에러로그 ID' })
  id: number;

  @Column({ type: 'varchar', nullable: false, comment: '에러 발생된 센서의 시리얼번호(sensor의 ID값)' })
  serial_number: string;

  @Column({ type: 'int', nullable: false, comment: '수신데이터의 ID' })
  lastPayLoadId: number;

  @Column({ type: 'enum', enum: MODEENUM, nullable: false, comment: '에러 생기기전 마지막 수신 데이터의 모드' })
  lastMode: MODEENUM;

  @Column({ type: 'timestamp with time zone', nullable: false, comment: '마지막 센서기준 데이터생성시간(UTC로 통일)' })
  lastTime: Date;

  @Column({ type: 'int', nullable: false, comment: '마지막 수신한 데이터 시간으로부터 지난 시간(초)' })
  delay_sec: number;

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

  @OneToOne(() => SensorPayloadEntity, (payload) => payload, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'lastPayLoadId' })
  lastPayload: SensorPayloadEntity
}
