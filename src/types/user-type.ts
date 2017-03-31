export const typeDef = `
    type User {
        email: String
        displayName: String
        password: String
        empId: String
        cl: String
        pl: String
        sl: String
        history: [String]
    }
`;

export interface User {
    email: String;
    displayName: String;
    password: String;
    empId: String;
    cl: String;
    pl: String;
    sl: String;
    history: [String];
};


