export const typeDef = `
    type UserType {
        email: String
        displayName: String
        password: String
        empId: String
        cl: String,
        pl: String,
        sl: String,
        history: [String]
    }
`;

export interface UserType {
    email: String;
    displayName: String;
    password: String;
    empId: String;
    cl: String;
    pl: String;
    sl: String;
    history: [String];
};


