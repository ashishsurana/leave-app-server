import { Document, Schema, Model } from "mongoose";
import  { mongoose } from '../data-base/database' 
import { User } from '../types/user-type'
import { Leave } from '../types/leave-type'
import { sendMail } from './mailer'

interface UserData extends User, Document { }

var userSchema = new Schema({
    email: {type:String,required: true, default:null},
    displayName : {type:String, required: true, default:null},
    empId : {type:String, required: true, default:null},
    password : {type:String, required: true, default:null}, 
    cl: {type:Number, default:10},
    pl: {type:Number, default:10},
    sl: {type:Number, default:10},
    isOnDuty : {type:Boolean, default:true},
    role : {type:String, required: true, default:"U"},
    requests : [{type:Schema.Types.ObjectId, required: true, default:null, ref : "Leave"}],
    moderator : {type: Schema.Types.ObjectId, required: false, ref: "User", default : null},
    otp : {type:String, default:null},
    history: [{ type: Schema.Types.ObjectId, required: true, ref: "Leave" , default: null}],
    department : {type:String, required: false, default:null}
}).index({ email : 1, empId : 1 },{ unique : true });

export const UserModel: Model<UserData> = mongoose.model<UserData>("User", userSchema);

export async function signUp (req, res, next) {
    let args = req.query;
    let user = new UserModel(args
    );
    await user.save(function(err, doc){
        if(doc){
            console.log("Doc ", doc);
                res.send( doc);
        }
        if(err){
            res.send(err) ;
            return;
        }
    });

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

export async function currentUserStatus(req, res, next) {
    let total:Number;
    let present:Number;
    let absent:Number;

    total = await UserModel.find().count().exec();
    present = await UserModel.find({isOnDuty : true}).count().exec();
    absent = await UserModel.find({isOnDuty : false}).count().exec();

    res.send({"total" : total, 'present': present, 'absent': absent});
}

