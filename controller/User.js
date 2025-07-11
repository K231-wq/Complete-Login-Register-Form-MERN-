const User = require('../models/User');
const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new BadRequestError("Please Enter Name, Email & Passwoord!!");
    }
    console.log("request Body: " + req.body);
    const user = await User.create({ ...req.body });
    console.log(user);
    if (!user) {
        throw new BadRequestError("SOMETHING WENT WRONG AT STORING DATA TO DB");
    }
    const token = user.createJWT();
    console.log(token);
    if (!token) {
        throw new BadRequestError("Token is not generate!!");
    }
    res.status(StatusCodes.CREATED).json({
        status: true,
        token: `Bearer ${token}`
    });

}
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please Enter Email & Password!!");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError("EMAIL ISN'T FOUND IN DB, PLEASE REGISTER AN ACCOUNT!!");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new BadRequestError("PASSWORD ISN'T CORRECT. RE-ENTER PASSWORD AFAIN!");
    }
    const token = await user.createJWT();
    res.status(StatusCodes.OK).json({
        user: {
            name: user.name,
            email: user.email,
        },
        token: `Bearer ${token}`
    });
}
module.exports = {
    register,
    login
};