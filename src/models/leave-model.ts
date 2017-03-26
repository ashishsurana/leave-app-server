import  mongoose = require( 'mongoose');
import { LeaveType } from '../types/leave-type'

var leaveSchema = new mongoose.Schema({
    email: String,
    displayName : String,
    empid : String,
    password : String, 
    cl: String,
    pl: String,
    sl: String,
    history: [String]// to be chagned to [Leave]
});


interface UserModel extends LeaveType, mongoose.Document { }

var Leave = mongoose.model<UserModel>("Leave", leaveSchema);


export async function applyLeave(root, args, ctx) {
    // add in leave db

    // update in user.history
    return "pj";

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