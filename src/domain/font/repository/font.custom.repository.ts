import { EntityRepository } from '@mikro-orm/postgresql';
import { Font } from '../domain/font.entity';
import { PaginationFilter } from 'src/common/format/pagination.format';
import { GetFontListFilterDto } from '../presentation/dto/request-dtos/get-font-list-filter.dto';
import { SearchFontFilterDto } from '../presentation/dto/request-dtos/search-font-filter.dto';
import { ApiListResponse } from 'src/common/format/pagination-response.format';
import { GetFontListDto } from '../presentation/dto/response-dtos/get-font-list.dto';
import { GetFontDetailDto } from '../presentation/dto/response-dtos/get-font-detail.dto';

export class FontCustomRepository extends EntityRepository<Font> {
  /**
   * @title getFontList
   * @description 폰트 목록 조회
   * @return ApiListResponse<GetFontListDto>
   */
  async getFontList(data: {
    pagination: PaginationFilter;
    filter: GetFontListFilterDto;
  }): Promise<ApiListResponse<GetFontListDto>> {
    try {
      const pagination = data?.pagination;
      const filter = data?.filter;
      const filterParams: unknown[] = [];
      const fontType = filter.fontType
        ? typeof filter.fontType != 'string'
          ? filter.fontType.map((value) => `'${value}'`).join(', ')
          : `'${filter.fontType}'`
        : filter.fontType;
      const license = filter.license
        ? typeof filter.license != 'string'
          ? filter.license.map((value) => `'${value}'`).join(', ')
          : `'${filter.license}'`
        : filter.license;

      if (filter && filter?.fontWeight) {
        filterParams.push(Number(filter?.fontWeight));
      }

      const total = await this.em.getConnection().execute(
        `
        SELECT CAST(COUNT(f.*) AS INTEGER) as total
        FROM public.font f
        INNER JOIN public."font_license" fl ON f.id = fl.font_id
        WHERE 1=1
        AND f.deleted_at is NULL
        `,
      );

      const count = await this.em.getConnection().execute(
        `
        SELECT CAST(COUNT(f.*) AS INTEGER) as count
        FROM public.font f
        INNER JOIN public."font_license" fl ON f.id = fl.font_id
        WHERE 1=1
        AND f.deleted_at is NULL
        ${filter && filter?.fontType && filter?.fontType?.length > 0 ? `AND f.type IN (${fontType})` : ''}
        ${
          filter && filter?.fontWeight
            ? `
              AND (
                SELECT CAST(COUNT(*) AS integer)
                FROM public.font_face ff
                WHERE ff.font_id = f.id
              ) >= ?
              `
            : ''
        }
        ${filter && filter?.license && filter?.license?.length > 0 ? `AND fl.category @> ARRAY[${license}]::text[]` : ''}
        `,
        filterParams,
      );

      if (pagination?.offset !== undefined && pagination?.limit !== undefined) {
        filterParams.push(pagination?.offset);
        filterParams.push(pagination?.limit);
      }

      const result: GetFontListDto[] = await this.em.getConnection().execute(
        `
        SELECT  f.id,
                f.title,
                f.author,
                f.type,
                (
                    SELECT CAST(COUNT(*) AS integer)
                    FROM public.font_face ff
                    WHERE ff.font_id = f.id
                ) AS font_weight,
                (
                    SELECT ff.font_face
                    FROM public.font_face ff
                    WHERE ff.font_id = f.id
                      AND ff."default" = true
                    LIMIT 1
                ) AS font_face,
                f.download_url,
                json_build_object(
                    'category', fl.category
                ) AS license,
                f.created_at,
                f.updated_at
        FROM public.font f
        INNER JOIN public."font_license" fl ON f.id = fl.font_id
        WHERE 1=1
        AND f.deleted_at is NULL
        ${filter && filter?.fontType && filter?.fontType?.length > 0 ? `AND f.type IN (${fontType})` : ''}
        ${
          filter && filter?.fontWeight
            ? `
              AND (
                SELECT CAST(COUNT(*) AS integer)
                FROM public.font_face ff
                WHERE ff.font_id = f.id
              ) >= ?
              `
            : ''
        }
        ${filter && filter?.license && filter?.license?.length > 0 ? `AND fl.category @> ARRAY[${license}]::text[]` : ''}
        ${filter?.orderBy && filter?.orderBy === 'name' ? `ORDER BY f.title ASC` : `ORDER BY f.id DESC`}
        ${
          pagination?.offset !== undefined && pagination?.limit !== undefined
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
          total: Number(total?.[0]?.total),
          count: Number(count?.[0]?.count),
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
   * @return GetFontDetailDto
   */
  async getFontDetail(data: { font_id: number }): Promise<GetFontDetailDto> {
    try {
      const filterParams: unknown[] = [];

      if (data?.font_id) {
        filterParams.push(data?.font_id);
      }

      const result: GetFontDetailDto = await this.em.getConnection().execute(
        `
        SELECT  f.id,
                f.title,
                f.author,
                f.type,
                (
                    SELECT CAST(COUNT(*) AS integer)
                    FROM public.font_face ff
                    WHERE ff.font_id = f.id
                ) AS font_weight,
                (
                    SELECT ff.font_face
                    FROM public.font_face ff
                    WHERE ff.font_id = f.id
                      AND ff."default" = true
                    LIMIT 1
                ) AS font_face,
                (
                    SELECT json_agg(
                      json_build_object(
                        'font_face', ff.font_face,
                        'font_weight', ff.font_weight,
                        'default', ff."default"
                      )
                    )
                    FROM public.font_face ff
                    WHERE ff.font_id = f.id
                ) AS font_face_list,
                f.download_url,
                json_build_object(
                    'content', fl.content,
                    'category', fl.category
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

  /**
   * @title searchFont
   * @description 폰트 검색
   * @return ApiListResponse<GetFontListDto>
   */
  async searchFont(data: {
    pagination: PaginationFilter;
    filter: SearchFontFilterDto;
  }): Promise<ApiListResponse<GetFontListDto>> {
    try {
      const pagination = data?.pagination;
      const filter = data?.filter;
      const filterParams: unknown[] = [];

      if (filter && filter?.search) {
        filterParams.push(`%${filter?.search}%`);
        filterParams.push(`%${filter?.search}%`);
      }

      const total = await this.em.getConnection().execute(
        `
        SELECT CAST(COUNT(f.*) AS INTEGER) as total
        FROM public.font f
        INNER JOIN public."font_license" fl ON f.id = fl.font_id
        WHERE 1=1
        AND f.deleted_at is NULL
        `,
      );

      const count = await this.em.getConnection().execute(
        `
        SELECT CAST(COUNT(f.*) AS INTEGER) as count
        FROM public.font f
        INNER JOIN public."font_license" fl ON f.id = fl.font_id
        WHERE 1=1
        AND f.deleted_at is NULL
        ${filter && filter?.search ? 'AND (f."title" ILIKE ? OR f."author" ILIKE ?)' : ''}
        `,
        filterParams,
      );

      if (pagination?.offset !== undefined && pagination?.limit !== undefined) {
        filterParams.push(pagination?.offset);
        filterParams.push(pagination?.limit);
      }

      const result: GetFontListDto[] = await this.em.getConnection().execute(
        `
        SELECT  f.id,
                f.title,
                f.author,
                f.type,
                (
                    SELECT CAST(COUNT(*) AS integer)
                    FROM public.font_face ff
                    WHERE ff.font_id = f.id
                ) AS font_weight,
                (
                    SELECT ff.font_face
                    FROM public.font_face ff
                    WHERE ff.font_id = f.id
                      AND ff."default" = true
                    LIMIT 1
                ) AS font_face,
                f.download_url,
                json_build_object(
                    'category', fl.category
                ) AS license,
                f.created_at,
                f.updated_at
        FROM public.font f
        INNER JOIN public."font_license" fl ON f.id = fl.font_id
        WHERE 1=1
        AND f.deleted_at is NULL
        ${filter && filter?.search ? 'AND (f."title" ILIKE ? OR f."author" ILIKE ?)' : ''}
        ORDER BY f.id DESC
        ${
          pagination?.offset !== undefined && pagination?.limit !== undefined
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
          total: Number(total?.[0]?.total),
          count: Number(count?.[0]?.count),
          offset: Number(data?.pagination?.offset),
          limit: Number(data?.pagination?.limit),
        },
      };
    } catch (e) {
      throw e;
    }
  }
}
