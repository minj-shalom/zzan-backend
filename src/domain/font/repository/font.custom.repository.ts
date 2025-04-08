import { EntityRepository } from '@mikro-orm/postgresql';
import { Font } from '../domain/font.entity';
import { PaginationFilter } from 'src/common/format/pagination-filter.format';

export class FontCustomRepository extends EntityRepository<Font> {
  /**
   * @title getFontList
   * @description 폰트 목록 조회
   * @return Font[]
   */
  async getFontList(data: { pagination?: PaginationFilter }): Promise<any> {
    try {
      const filterParams: unknown[] = [];

      const count = await this.em.getConnection().execute(
        `
        SELECT CAST(COUNT(f.*) AS INTEGER) as count
        FROM public.font f
        INNER JOIN public."font_license" fl ON f.id = fl.font_id
        WHERE 1=1
        AND f.deleted_at is NULL
        `,
      );

      if (data?.pagination?.offset && data?.pagination?.limit) {
        filterParams.push(Number(data?.pagination?.offset));
        filterParams.push(Number(data?.pagination?.limit));
      }

      const result = await this.em.getConnection().execute(
        `
        SELECT  f.id,
                f.title,
                f.author,
                f.type,
                f.font_weight,
                f.font_face,
                f.download_url,
                f.created_at,
                f.updated_at
        FROM public.font f
        INNER JOIN public."font_license" fl ON f.id = fl.font_id
        WHERE 1=1
        AND f.deleted_at is NULL
        ORDER BY f.id DESC
        ${
          data?.pagination?.offset && data?.pagination?.limit
            ? `
            OFFSET ?
            LIMIT ?;
          `
            : ''
        }
        `,
        filterParams,
      );

      return {
        data: result,
        pagination: {
          total: Number(count?.[0]?.count),
          offset: Number(data?.pagination?.offset),
          limit: Number(data?.pagination?.limit),
        },
      };
    } catch (e) {
      throw e;
    }
  }

  /**
   * @title getFontDetail
   * @description 폰트 상세 조회
   * @return Font
   */
  async getFontDetail(data: { font_id: number }): Promise<any> {
    try {
      const filterParams: unknown[] = [];

      if (data?.font_id) {
        filterParams.push(data?.font_id);
      }

      const result = await this.em.getConnection().execute(
        `
        SELECT  f.id,
                f.title,
                f.author,
                f.type,
                f.font_weight,
                f.font_face,
                f.download_url,
                json_build_object(
                    'license', fl.license,
                    'print', fl.print,
                    'website', fl.website,
                    'packaging', fl.packaging,
                    'video', fl.video,
                    'embedding', fl.embedding,
                    'bi_ci', fl.bi_ci,
                    'ofl', fl.ofl
                ) AS license,
                f.created_at,
                f.updated_at
        FROM public.font f
        INNER JOIN public."font_license" fl ON f.id = fl.font_id
        WHERE 1=1
        AND f.deleted_at is NULL
        ${data?.font_id ? `AND f.id = ?` : ''}
        `,
        filterParams,
      );

      return result?.[0];
    } catch (e) {
      throw e;
    }
  }
}
