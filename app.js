require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticationMiddleware = require('./middleware/Authentication');

const AuthControllerRoutes = require('./routes/Auth');
const UserControllerRoutes = require('./routes/userRoutes');

const errorHandlerMiddleware = require('./middleware/error_handler');
const notFoundMiddleware = require('./middleware/not-found');

const port = process.env.PORT || 8085;
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5173/'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    //allowed frontend url
    origin: allowedOrigins,
    credentials: true
}));

app.get('/', (req, res) => {
    res.status(200).json({ msg: "API IS WORKING" });
});

app.use("/api/v1/auth", AuthControllerRoutes);
app.use("/api/v1/user", UserControllerRoutes);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);


const start = async (req, res) => {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
        console.log(`SERVER IS RUNNING ON http://localhost:${port}`)
    })
}
start();