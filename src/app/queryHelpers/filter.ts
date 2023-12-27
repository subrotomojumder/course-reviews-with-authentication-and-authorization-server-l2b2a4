import { Query } from 'mongoose';
import { IQueryObj } from '../interface/global.interface';

export const filter = <T>(modelQuery: Query<T[], T>, query: IQueryObj) => {
  const queryObj = { ...query };
  const excludedFields = [
    'page',
    'searchTerm',
    'limit',
    'sortBy',
    'sortOrder',
    'fields',
    'tags',
    'minPrice',
    'maxPrice',
    'startDate',
    'endDate',
  ];
  excludedFields.forEach((key) => delete queryObj[key]);
  if (query.startDate && query.endDate) {
    modelQuery = modelQuery.find({
      $and: [
        { startDate: { $gte: new Date(query?.startDate as string) } },
        { endDate: { $lte: new Date(query?.endDate as string) } },
      ],
    });
  } else if (query.startDate && !query.endDate) {
    queryObj.startDate = new Date(query?.startDate as string);
  } else if (!query.startDate && query.endDate) {
    queryObj.endDate = new Date(query?.endDate as string);
  }
  if (query.tags) {
    queryObj[`tags.name`] = query.tags;
  }
  if (query.maxPrice) {
    modelQuery = modelQuery.find({
      $and: [
        { price: { $gte: query?.minPrice || 0 } },
        { price: { $lte: query.maxPrice } },
      ],
    });
  } else if (query.minPrice) {
    modelQuery = modelQuery.find({ price: { $gte: query?.minPrice } });
  }
  modelQuery = modelQuery.find(queryObj);

  return modelQuery;
};
