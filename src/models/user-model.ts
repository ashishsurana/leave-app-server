import { Document, Schema, Model } from "mongoose";
import  { mongoose } from '../data-base/database' 
import { User } from '../types/user-type'
import { Leave } from '../types/leave-type'
import { sendMail } from './mailer'

interface UserData extends User, Document { }

var userSchema = new Schema({
    email: {type:String, default:null},
    displayName : {type:String, default:null},
    empId : {type:String, default:null},
    password : {type:String, default:null}, 
    cl: {type:Number, default:10},
    pl: {type:Number, default:10},
    sl: {type:Number, default:10},
    isOnDuty : Boolean,
    otp : {type:String, default:null},
    history: [{ type: Schema.Types.ObjectId, required: true, ref: "Leave" }]
});

export const UserModel: Model<UserData> = mongoose.model<UserData>("User", userSchema);

export async function signUp (req, res, next) {
    let args = req.query;
    let user = new UserModel(args
    );
    await user.save(function(err, doc){
        if(doc){
            console.log("Doc ", doc);
        }
        if(err){
            res.send(err) ;
        }
    });
    res.send( user);
}

export async function logIn (req, res, next) {
    let args = req.query;
        console.log("User",args);
    let user =await UserModel.findOne({email : args.email});
    console.log("User",user);
    if(user){
        sendMail(user.email);
        res.send ("Email sent");
    } else
    res.send({error : "Not found"});
}

export async function matchOtp(req, res, next){
    let args = req.query;
    
    let user = await UserModel.findOne({email : args.email}).exec(function(err, doc){
        // console.log(err, doc);
    });

    if(user.otp == args.otp){
        res.send(user);                
    }
    else {
        res.send("OTP not matched");
    }

}

export async function getUserDetail(req, res, next) {
    let user = await UserModel.findById({_id : req.query.id})
                .populate("history")
                .exec(function(err, res){
        if(err){
            console.log("Error is ", err);
        }
    });
    res.send(user);
}

export async function currentUserStatus(root, args, ctx) {

}

