import { Document, Schema, Model } from "mongoose";
import  { mongoose } from '../data-base/database' 

interface Role {
    name : String;
    cl : Number;
    pl : Number;
    sl : Number;
}

interface RoleData extends Role, Document { }

var RoleSchema = new Schema({
    name : {type: String},
    cl : Number,
    pl : Number,
    sl : Number
});

export const RoleModel: Model<RoleData> = mongoose.model<RoleData>("roles", RoleSchema);

