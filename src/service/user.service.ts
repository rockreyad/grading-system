import User, { UserDocument } from '../models/users';

import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';

export function createUser(input: DocumentDefinition<UserDocument>) {
    return User.create(input);
}

export function findUser(query: FilterQuery<UserDocument>, options: QueryOptions = { lean: true }) {
    return User.find(query, {}, options);
}

export function findAndUpdate(query: FilterQuery<UserDocument>, update: UpdateQuery<UserDocument>, options: QueryOptions) {
    return User.findOneAndUpdate(query, update, options);
}

export function deleteUser(query: FilterQuery<UserDocument>) {
    return User.deleteOne(query);
}