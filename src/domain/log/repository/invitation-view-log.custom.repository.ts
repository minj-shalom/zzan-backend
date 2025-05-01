import { EntityRepository } from '@mikro-orm/postgresql';
import { FontViewLog } from '../domain/invitation-view-log.entity';

export class FontViewLogCustomRepository extends EntityRepository<FontViewLog> {
  /**
   * @title insertFontViewLog
   * @description 폰트 조회 로그 생성
   * @return FontViewLog id
   */
  async insertFontViewLog(data: FontViewLog): Promise<{ id: number }> {
    try {
      const result = await this.createQueryBuilder()
        .insert({
          font_id: data?.font_id,
          ip: data?.ip,
          fingerprint: data?.fingerprint,
          created_at: new Date(),
        })
        .execute();

      return result[0].id;
    } catch (e) {
      throw e;
    }
  }
}
