require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticationMiddleware = require('./middleware/Authentication');

const UserControllerRoutes = require('./routes/Auth');
const PageControllerRoutes = require('./routes/page');

const errorHandlerMiddleware = require('./middleware/error_handler');
const notFoundMiddleware = require('./middleware/not-found');

const port = process.env.PORT || 8085;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: `http://localhost:${port}`,
    credentials: true
}));

app.get('/', (req, res) => {
    res.status(200).json({ msg: "API IS WORKING" });
});

app.use("/api/v1/auth", UserControllerRoutes);
app.use("/api/v1/page", authenticationMiddleware, PageControllerRoutes);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);


const start = async (req, res) => {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
        console.log(`SERVER IS RUNNING ON http://localhost:${port}`)
    })
}
start();