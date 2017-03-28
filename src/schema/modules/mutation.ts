import { signUp, logIn, getUserDetail } from '../../models/user-model'
import { UserType } from '../../types/user-type'
import { applyLeave, changeStatus } from '../../models/leave-model'

export const typeDef = `
# Mutations
type Mutation {
    addPerson(name: String!, sex: String!): PersonType
    signUp(email: String, displayName : String, empid : String, password : String) : String
    logIn(email: String, passowrd: String) : String
    applyLeave(param1: String) : String
    changeStatus(leaveId: String!, status : String): Boolean
}
`;

export const resolver = {
  Mutation: {
    addPerson(root, args, ctx) {
      return ctx.addPerson(ctx.persons, {id: Math.random().toString(16).substr(2), name: args.name, sex: args.sex});
    },
    signUp, 
    logIn,
    // leave regarding
    applyLeave,
    changeStatus
  },
};
