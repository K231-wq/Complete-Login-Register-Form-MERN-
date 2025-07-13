const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name must be provided!!"],
        minLength: 3,
        maxLength: 255
    },
    email: {
        type: String,
        required: [true, "Email must be provided!!"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide Valid Email!!"
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password must be provided!!"],
        minLength: 3,
        maxLength: 256
    },
    verifyOtp: {
        type: String,
        default: '',
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0
    }
},
    { timestamps: true }
);

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return; //don't need to hash if the code is not update
    const getSalt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, getSalt);
});

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_CODE_HALFTIME
        }
    );
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

module.exports = mongoose.model("User", UserSchema);