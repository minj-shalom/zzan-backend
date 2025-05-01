import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Font } from 'src/domain/font/domain/font.entity';
import { FontViewLogCustomRepository } from '../repository/invitation-view-log.custom.repository';

@Entity({
  repository: () => FontViewLogCustomRepository,
  tableName: 'font_view_log',
})
export class FontViewLog {
  @PrimaryKey({
    nullable: false,
    autoincrement: true,
    columnType: 'int4',
    unsigned: true,
  })
  id!: number;

  @ManyToOne({
    fieldName: 'font_id',
    entity: () => Font,
    columnType: 'int4',
    unsigned: true,
    comment: '폰트 id',
  })
  font_id: number;

  @Property({ nullable: false, columnType: 'varchar', comment: '접속 ip 주소' })
  ip: string;

  @Property({ nullable: false, columnType: 'json', comment: '핑거프린트' })
  fingerprint: object;

  @Property({ nullable: false, comment: '생성 일시' })
  created_at: Date;

  constructor(data: { font_id: number; ip: string; fingerprint: object }) {
    this.font_id = data.font_id;
    this.ip = data.ip;
    this.fingerprint = data.fingerprint;
  }
}
