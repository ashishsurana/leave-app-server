import mongoose = require("mongoose");
import { LeaveModel } from '../models/leave-model'
import { UserModel, } from '../models/user-model'

mongoose.Promise = Promise;

    const dbURI = 'mongodb://localhost/leave';

    function connect() {
        mongoose.connect(dbURI, <mongoose.ConnectionOptions>{ auto_reconnect: true }).catch(() => {});
    }

    const db = mongoose.connection;;

    db.on('error', (error) => {
        console.error(`MongoDB connection error: ${error}`);
        mongoose.disconnect();
    });

    db.on('connected', () => {
        console.info('Connected to MongoDB!');

        let admin1 = UserModel.find({ email: "admin" }).exec(function (err, doc) {
            console.log("Doc is ", doc);
            console.log("Err is ", err);
            
            if (doc.length == 0) {

                // making first entries
                let admin = new UserModel({
                    email: "admin",
                    empId: "admin",
                    moderator: null,
                    otp: null,
                    role: "A",
                    isOnDuty: true,
                    password: "admin",
                    displayName: "admin"

                });
                admin.save();
            }
        })
    });
    connect();



export { mongoose };
