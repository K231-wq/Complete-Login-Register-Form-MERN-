const mongoose = require('mongoose');

const connect = async (url) => {
    try {
        const conn = await mongoose.connect(url);
        console.log("Connection is successfully established: " + conn.connection.host);
    } catch (error) {
        console.log("Database Connection error: " + error.message);
    }
}
module.exports = connect;