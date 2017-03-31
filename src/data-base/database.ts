import mongoose = require("mongoose");

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
    });
    connect();

export { mongoose };
