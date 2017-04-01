import { Document, Schema, Model } from "mongoose";
import  { mongoose } from '../data-base/database' 
import { User } from '../types/user-type'
import { Leave } from '../types/leave-type'
import { UserModel } from './user-model'

interface LeaveData extends Leave, Document { }


var leaveSchema = new Schema({
    reason: { type: String, required: true },
    status : { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    startDate : String,
    endDate : String,
    approvedBy : { type: Schema.Types.ObjectId, ref: "User" }
});

export const LeaveModel: Model<LeaveData> = mongoose.model<LeaveData>("Leave", leaveSchema);

export async function applyLeave(root, args, ctx) {
    // add in leave db
    let leave = await new LeaveModel(args)
                .populate("user")
                .execPopulate();
    await leave.save();
    // update in user.history
    await UserModel.update({_id:args.user},{$addToSet:{history : mongoose.Types.ObjectId(leave._id)}}).exec(function(err, res){
        console.log(err, res);
    });

    return leave;
}

export async function changeStatus(root, args, ctx) {
    let flag = false;
    // find leave by id
    let leave =await LeaveModel.findByIdAndUpdate({_id : args.leaveId}, { status : args.status }).exec(function(err, res){

        if(res){
            console.log("Response is", res);
            flag = true;
        }
        if(err){
            console.log("Error is" , err);
            flag = false;
        }
    });
    return flag;
}

export async function getLeaveDetail(root, args, ctx) {
    let leave = await LeaveModel.findById({_id : args.id})
                .populate("user")
                .exec(function(err, res){
        if(err){
            console.log("Error is ", err);
        }
    });
    return leave;
}