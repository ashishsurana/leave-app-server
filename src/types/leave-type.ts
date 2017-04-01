import { User } from './user-type'

export const typeDef = `
    type Leave {
        id: ID!
        reason: String
        status: String
        startingDate: String
        endingDate: String
        user: User
        type : String
    }
`;

export interface Leave {
        reason: string;
        status: string;
        startingDate: string;
        endingDate: string;
        user: User;
        type : String;
};
