import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum NoticEmailColumns {
  id = 'id',
  email = 'email',
  name = 'name',
  mobile = 'mobile',
  available = 'available',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt'
}

@Entity({
  name: 'notic_email',
  comment: '알림 이메일 목록'
})
export class NoticEmailEntity {

  @PrimaryGeneratedColumn('increment', {
    type: 'int',
    comment: '이메일 ID'
  })
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    comment: '알림을 보내야하는 email'
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: '이메일 이름'
  })
  name: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: '이메일 주인의 전화번호'
  })
  mobile: string | null;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
    comment: '메일 전송 가능 여부'
  })
  available: boolean;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    comment: '레코드 생성 날짜'
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    comment: '레코드 업데이트 날짜'
  })
  updatedAt: Date;
}
