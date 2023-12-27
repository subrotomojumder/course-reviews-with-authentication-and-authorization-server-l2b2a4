import { Query } from 'mongoose';
import { IQueryObj } from '../interface/global.interface';

export const pagination = <T>(modelQuery: Query<T[], T>, query: IQueryObj) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  modelQuery.skip((page - 1) * limit).limit(limit);
  return modelQuery;
};
