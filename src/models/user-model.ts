import  mongoose = require( 'mongoose');
import {Model} from 'mongoose'

import { UserType } from '../types/user-type'

interface UserData extends UserType, mongoose.Document { }

var userSchema = new mongoose.Schema({
    email: String,
    displayName : String,
    empid : String,
    password : String, 
    cl: Number,
    pl: Number,
    sl: Number,
    history: [String]// to be chagned to [Leave]
});
export const UserModel: Model<UserData> = mongoose.model<UserData>("user", userSchema);

export async function signUp (root, args, ctx) {
    let user = new UserModel( args );
    return await user.save();
}

export async function logIn (root, args, ctx) {

    console.log("Arguments", args);

    return true;
}

export async function getUserDetail(root, args, ctx) {

    console.log("Arguments", args);

    return true;
}

