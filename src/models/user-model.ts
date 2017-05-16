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
    cl: {type:Number, default:0},
    clRem : {type :Number, default : 0 },
    pl: {type:Number, default:0},
    plRem : {type :Number, default : 0 },
    sl: {type:Number, default:0},
    gender : String,
    slRem : {type :Number, default : 0 },
    other : {type : Number, default : 0},
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
                .populate("requests")
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

export async function compareUsers(req, res, next) {
    let args = req.query;

    let user1 = await UserModel.findOne({email : args.email1})
                .populate("history")
                .exec(function(err, doc){
        if(err){
            console.log("Error is ", err);
            res.send(err);
        }
    });

    let user2 = await UserModel.findOne({email : args.email2})
                .populate("history")

                .exec(function(err, doc){
        if(err){
            console.log("Error is ", err);
            res.send(err);
            return;
        }
    });

    console.log("Get Status", getStats(user1.history))

    res.send({"user1" : getStats(user1.history),
              "user2" : getStats(user2.history) 
             });

}

function getStats(leaves){
    let approved = 0, rejected = 0, awaited = 0;

    leaves.map((l) => {
        if(l.status == "Waiting"){
            awaited++;
        }
        if(l.status == "Approved"){
            approved++;
        }
        if(l.status == "Rejected"){
            rejected++;
        }
    });

    return { "totalLeaves" : leaves.length, 
                "approved" : approved,
                "rejected" : rejected,
                "awaited" : awaited
             }
}

export async function compareDepartMents(req, res, next) {
    let args = req.query;

    let users1 = await UserModel.find({department : args.dept1})
                .populate("history")
                .exec(function(err, doc){
        if(err){
            console.log("Error is ", err);
        }
    });

    let users2 = await UserModel.find({department : args.dept2})
                .populate("history")
                .exec(function(err, doc){
        if(err){
            console.log("Error is ", err);
        }
    });

    res.send({"dept1" : getCurrentStats(users1),
              "dept2" : getCurrentStats(users2)
    });
}

function getCurrentStats(user1){
    let total = 0, present = 0, absent =0;
    user1.map((u) => {
        if(u.isOnDuty == true){
            present ++;
        }
        else{
            absent ++ ;
        }
    });

    return {"total" : user1.length, 'present': present, 'absent': absent};
}

export async function moderatorStatus(req, res, next) {
    let args = req.query;

    let user = await UserModel.findById({_id : args.id})
                .populate("requests")
                .exec(function(err, doc){
        if(err){
            console.log("Error is ", err);
        }
    });

    res.send(getStats(user.requests));
}

export async function getAllUsers (req, res, next) {
    res.send(await UserModel.find({})
                .populate("requests")
                .exec(function(err, doc){
        if(err){
            console.log("Error is ", err);
        }
    })
);
}

export async function getAllData(req, res, next){
    let obj = {centralGov : {} };
    let users = await UserModel.find({department : "Transport Department"}).exec();
    obj.centralGov["Transport Department"] = users;
    let users2 = await UserModel.find({department : "Health Department"}).exec();
    obj.centralGov["Health Department"] = users2;
    let users3 = await UserModel.find({department : "Road Department"}).exec();
    obj.centralGov["Road Department"] = users3;
    let users4 = await UserModel.find({department : "Medical Department"}).exec();
    obj.centralGov["Medical Department"] = users4;
    res.send(obj);
}