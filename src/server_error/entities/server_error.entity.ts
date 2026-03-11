import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum ServerErrorColumns {
    id = 'id',
    statusCode = 'statusCode',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt'
}

@Entity({
    name: 'server_error',
    comment: '서버안에서 발생하는 에러 로그'
})
export class ServerErrorEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type : 'varchar', nullable : false, comment : '에러 위치'})
    location : string;

    @Column({ type: 'int', nullable: false, comment: '서버 상태로그' })
    statusCode: number;

    @Column({ type: 'text', nullable: false, comment: '서버 에러 메세지' })
    note: string;

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
