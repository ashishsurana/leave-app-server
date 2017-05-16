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
        user: User;
        startDate : String;
        endDate : String;
        applyTime: Date;
        responseTime : Date;
        moderator : User;
        type : String;
        days : Number;
        empId : String;
};
