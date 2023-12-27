import { FilterQuery, Query } from 'mongoose';
import { IQueryObj, ISearchFields } from '../interface/global.interface';

export const search = <T>(
  modelQuery: Query<T[], T>,
  query: IQueryObj,
  searchFields: ISearchFields,
) => {
  if (query.searchTerm) {
    modelQuery.find({
      $or: searchFields.map(
        (field) =>
          ({
            [field]: { $regex: query.searchTerm, $options: 'i' },
          }) as FilterQuery<T>,
      ),
    });
  }
  return modelQuery;
};
