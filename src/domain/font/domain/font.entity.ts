import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { FontCustomRepository } from '../repository/font.custom.repository';
import { FontTypeEnum } from './status/FontTypeEnum';

@Entity({
  repository: () => FontCustomRepository,
  tableName: 'font',
})
export class Font {
  @PrimaryKey({
    nullable: false,
    autoincrement: true,
    columnType: 'int4',
    unsigned: true,
  })
  id!: number;

  @Property({
    nullable: false,
    comment: '이름',
  })
  title: string;

  @Property({
    nullable: false,
    comment: '제작',
  })
  author: string;

  @Property({
    nullable: false,
    comment: '타입',
  })
  type: FontTypeEnum;

  @Property({
    nullable: false,
    comment: '다운로드 링크',
  })
  download_url: string;

  @Property({
    nullable: false,
    comment: '생성 일시',
  })
  created_at: Date;

  @Property({
    nullable: true,
    comment: '수정 일시',
  })
  updated_at?: Date;

  @Property({
    nullable: true,
    comment: '삭제 일시',
  })
  deleted_at?: Date;

  constructor(data: {
    title: string;
    author: string;
    type: FontTypeEnum;
    download_url: string;
  }) {
    this.title = data?.title;
    this.author = data?.author;
    this.type = data?.type;
    this.download_url = data?.download_url;
  }
}
