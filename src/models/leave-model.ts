import { Document, Schema, Model } from "mongoose";
import  { mongoose } from '../data-base/database' 
import { User } from '../types/user-type'
import { Leave } from '../types/leave-type'
import { UserModel } from './user-model'

interface LeaveData extends Leave, Document { }


var leaveSchema = new Schema({
    reason: String,
    status : String,
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    startDate : String,
    endDate : String
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
    // find by id and send
    return "jn";
}