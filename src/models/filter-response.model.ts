import { z } from 'zod';
import { TPageInfo } from './page-info.model';

export type TFilterResponse<Data = any> = {
  data: Data[];
  pageInfo: TPageInfo;
};
