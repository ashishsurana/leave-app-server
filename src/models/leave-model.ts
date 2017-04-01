import { Document, Schema, Model } from "mongoose";
import  { mongoose } from '../data-base/database' 
import { User } from '../types/user-type'
import { Leave } from '../types/leave-type'

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
    // leave.populate("user");
    // update in user.history
    return leave;
}

export async function changeStatus(root, args, ctx) {
    // find leave by id
    
    // change status & save
    return "kj";
}

export async function getLeaveDetail(root, args, ctx) {
    // find by id and send
    return "jn";
}