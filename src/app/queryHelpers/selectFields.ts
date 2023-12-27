import { Query } from 'mongoose'
import { IQueryObj } from '../interface/global.interface'

export const selectFields = <T>(modelQuery: Query<T[], T>, query: IQueryObj) => {
  if (query.fields) {
    const fields = query.fields.split(',').join(' ')
    modelQuery.select(fields)
  }

  return modelQuery
}
