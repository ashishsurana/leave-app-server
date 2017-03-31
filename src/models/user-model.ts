import { Document, Schema, Model } from "mongoose";
import  { mongoose } from '../data-base/database' 
import { User } from '../types/user-type'

interface UserData extends User, Document { }

var userSchema = new Schema({
    email: String,
    displayName : String,
    empid : String,
    password : String, 
    cl: Number,
    pl: Number,
    sl: Number,
    history: [String]
});
export const UserModel: Model<UserData> = mongoose.model<UserData>("User", userSchema);

export async function signUp (root, args, ctx) {
    let user = new UserModel( args );
    return await user.save();
}

export async function logIn (root, args, ctx) {
    let user = new UserModel( args );
    return await user.save();

}

export async function getUserDetail(root, args, ctx) {

    console.log("Arguments", args);

    return true;
}

