import { Document, Schema, Model } from "mongoose";
import  { mongoose } from '../data-base/database' 
import { User } from '../types/user-type'

interface UserData extends User, Document { }

var userSchema = new Schema({
    email: {type:String, default:null},
    displayName : {type:String, default:null},
    empId : {type:String, default:null},
    password : {type:String, default:null}, 
    cl: {type:Number, default:null},
    pl: {type:Number, default:null},
    sl: {type:Number, default:null},
    history: [{type:String, default:null}]
});
export const UserModel: Model<UserData> = mongoose.model<UserData>("User", userSchema);

export async function signUp (root, args, ctx) {
    let user = new UserModel(args
    );
    await user.save(function(err, doc){
        if(doc){
            console.log("Doc ", doc);
        }
        if(err){
            return err;
        }
    });
    return user;
}

export async function logIn (root, args, ctx) {
    let user =await UserModel.findOne({email : args.email});
    console.log("User",args);
    console.log("User",user);
    if(user.password == args.password){
        console.log("password matched matched");
        return user;
    }
    return null;
}

export async function getUserDetail(root, args, ctx) {

    console.log("Arguments", args);

    return true;
}

