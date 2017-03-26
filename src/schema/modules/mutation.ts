import { signUp, logIn, getUserDetail } from '../../models/user-model'
import { UserType } from '../../types/user-type'
// import { } from '../../models/leave-model'

export const typeDef = `
# Mutations
type Mutation {
    addPerson(name: String!, sex: String!): PersonType
    signUp(id:String) : String
    logIn(email: String, passowrd: String) : Boolean
    getUserDetail(id: String!) : String
}
`;

export const resolver = {
  Mutation: {
    addPerson(root, args, ctx) {
      return ctx.addPerson(ctx.persons, {id: Math.random().toString(16).substr(2), name: args.name, sex: args.sex});
    },
    signUp, 
    logIn,
    getUserDetail
  },
};
