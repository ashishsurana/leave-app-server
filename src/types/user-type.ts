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
        history: [String]
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
    history: [string];
};


