const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//Encrypt pass with bcrypt
UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next();
    }

    const user = this;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
})

//Sign JTW and return

UserSchema.methods.getSignedJwtToken = function () {
    const user = this;
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//Generate and hash password token

UserSchema.methods.getResetPasswordToken = function () {

    //Must be in string crypto give us a Buffer
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hash token and set to reset password token field

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    //Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}


module.exports = mongoose.model('User', UserSchema)