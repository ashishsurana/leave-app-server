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
    clRem : number;
    pl: number | 0;
    plRem : number;
    sl: number | 0;
    slRem : number;
    patl : number;
    patRem : number;
    matl : number;
    matRem : number;
    other : number;
    history: [Leave];
    otp : String;
    gender : String;
    isOnDuty : Boolean;
    role : String;
    requests : [Leave];
    moderator : User;
    department : String;
};


