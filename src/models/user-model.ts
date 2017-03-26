import  mongoose = require( 'mongoose');

import { UserType } from '../types/user-type'

var userSchema = new mongoose.Schema({
    email: String,
    displayName : String,
    empid : String,
    password : String, 
    cl: String,
    pl: String,
    sl: String,
    history: [String]// to be chagned to [Leave]
});

interface UserModel extends UserType, mongoose.Document { }

var User = mongoose.model<UserModel>("User", userSchema);

export async function signUp (root, args, ctx) {

    return JSON.stringify(args);
}

export async function logIn (root, args, ctx) {

    console.log("Arguments", args);

    return true;
}

export async function getUserDetail(root, args, ctx) {

    console.log("Arguments", args);

    return true;
}

