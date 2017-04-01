import { signUp, logIn, getUserDetail } from '../../models/user-model'
import { User } from '../../types/user-type'
import { applyLeave, changeStatus } from '../../models/leave-model'

export const typeDef = `
# Mutations
type Mutation {
    addPerson(name: String!, sex: String!): PersonType

    signUp(email: String!, displayName : String!, empId : String!, password : String!) : User
    logIn(email: String!, password: String!) : User
    applyLeave(reason: String!, user : ID!, type : String!) : Leave
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
