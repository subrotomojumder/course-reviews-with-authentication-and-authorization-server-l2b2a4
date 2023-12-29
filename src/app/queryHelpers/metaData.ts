import { Query } from 'mongoose';
import { IQueryObj } from '../interface/global.interface';

export const metaData = async <T>(
  modelQuery: Query<T[], T>,
  query: IQueryObj,
) => {
  const totalQueries = modelQuery.getFilter();
  const total = await modelQuery.model.countDocuments(totalQueries);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
//   const totalPage = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    // totalPage,
  };
};
