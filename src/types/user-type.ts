import {Leave} from './leave-type'

export const typeDef = `
    type User {
        id: ID!
        email: String
        displayName: String
        password: String
        empId: String
        cl: Int
        pl: Int
        sl: Int
        history: [Leave]
        otp : String
    }
`;

export interface User {
    email: string | null;
    displayName: string | null;
    password: string | null;
    empId: string | null;
    cl: number | 0;
    pl: number | 0;
    sl: number | 0;
    history: [Leave];
    otp : String;
    isOnDuty : Boolean;
    isModerator : Boolean;
    requests : [Leave];
    moderator : User;
};


