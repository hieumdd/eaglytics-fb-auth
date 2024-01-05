import { withMongoConnection } from '../mongo.service';

export type User = {
    id: string;
    access_token: string;
};

export const userRepository = withMongoConnection<User>('user');
