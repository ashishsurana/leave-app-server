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
}).index({name:1},{ unique : true });

export const RoleModel: Model<RoleData> = mongoose.model<RoleData>("roles", RoleSchema);

new RoleModel({name : "M",
                cl:5,
                pl:5,
                sl:5,
            })
            .save();
new RoleModel({name : "U",
                cl:3,
                pl:3,
                sl:3,
            })
            .save();
