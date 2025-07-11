require('dotenv').config();
require('express-async-errors');

const expres = require('express');
const app = expres();

const connectDB = require('./db/connect');

const UserControllerRoutes = require('./routes/User');

const errorHandlerMiddleware = require('./middleware/error_handler');
const notFoundMiddleware = require('./middleware/not-found');

app.use(expres.json());

app.get('/', (req, res) => {
    res.status(200).json({ msg: "API IS WORKING" });
});

app.use("/api/v1", UserControllerRoutes);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 8085;
const start = async (req, res) => {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
        console.log(`SERVER IS RUNNING ON http://localhost:${port}`)
    })
}
start();