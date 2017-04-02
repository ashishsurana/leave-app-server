import { Document, Schema, Model } from "mongoose";
import  { mongoose } from '../data-base/database' 
import { User } from '../types/user-type'
import { Leave } from '../types/leave-type'
import { UserModel } from './user-model';
import { sendMail } from './mailer'

interface LeaveData extends Leave, Document { }


var leaveSchema = new Schema({
    reason: { type: String, required: true },
    status : { type: String, required: true, default : "Waiting" },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    startDate : Date,
    endDate : Date,
    applyTime: {type: Date, default : Date.now()},
    responseTime : {type: Date},
    days : { type: Number, required: true },
    empId : String,
    moderator : { type: Schema.Types.ObjectId, ref: "User" },
    type : String
});

export const LeaveModel: Model<LeaveData> = mongoose.model<LeaveData>("Leave", leaveSchema);

export async function applyLeave(req, res, next) {
    let args = req.query;
    let type = args.type;
    
    // add in leave db
    let leave = await new LeaveModel(args)
                .populate("user.requests")
                .execPopulate();
    await leave.save(function(err, doc){
        if(err){
            res.send(err);
            return;
        }
    });
    // update in user.history
    let user = await UserModel.findByIdAndUpdate({_id:args.user},{$addToSet:{history : mongoose.Types.ObjectId(leave._id)}}).exec(function(err, doc){
        console.log(err, doc);
        if(err){
            res.send(err);
        }
        if(doc){
            // user = doc;
        }
    });

    // update in moderator requests
    await UserModel.findByIdAndUpdate({_id: user.moderator}, {$addToSet : {requests : mongoose.Types.ObjectId(leave._id)}});

    leave.moderator = user.moderator;
    leave.empId = user.empId;
    leave.save()

    res.send( leave);
}

export async function changeStatus(req, res, next) {
    let args = req.query;
    let flag = false;
    // find leave by id
    let leave =await LeaveModel.findByIdAndUpdate({_id : args.id}, { status : args.status, responseTime : Date.now() }).exec(function(err, doc){
        if(doc){
            console.log("Response is", doc);
            flag = true;
        }
        if(err){
            console.log("Error is" , err);
            res.send(true);
        }
    });
     

    let user = await UserModel.findById({_id: leave.user});

    if (args.status == "Approved"){
        console.log("Leave type is", leave.type);
        user[String(leave.type)]
        console.log(user[String(leave.type)] = user[String(leave.type)] - Number(leave.days) );
        user.save();
    }

    res.send(true);
}

export async function getLeaveDetail(req, res, next) {
    let leave = await LeaveModel.findById({_id : req.query.id})
                .populate("user")
                .exec(function(err, res){
        if(err){
            console.log("Error is ", err);
        }
    });
    res.send(leave) ;
}

export async function userLeaveHistory(req, res, next) {
    let args = req.query;
    let approved = 0, rejected = 0, awaited = 0;
    let user = await UserModel.findById({_id:args.id})
                                .populate("history")
                                .exec();

    let leaves = user.history;
    console.log(leaves);

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
    }).length;

    res.send( { "totalLeaves" : leaves.length, 
                "approved" : approved,
                "rejected" : rejected,
                "awaited" :awaited
             });
}