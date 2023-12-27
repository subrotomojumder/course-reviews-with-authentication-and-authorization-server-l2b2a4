import { Query } from 'mongoose';
import { IQueryObj } from '../interface/global.interface';

export const sort = <T>(modelQuery: Query<T[], T>, query: IQueryObj) => {
  const specificSortFiled = [
    'title',
    'price',
    'startDate',
    'endDate',
    'language',
    'duration',
  ];
  if (specificSortFiled.includes(query.sortBy as string)) {
    const sortBy = query.sortBy as string;
    const sortStr = `${query.sortOrder === 'desc' ? '-' : ''}${sortBy}`;
    modelQuery.sort(sortStr);
  }

  return modelQuery;
};
