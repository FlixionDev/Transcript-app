const express = require('express');
const { UserModel } = require('../Models/User.Model');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

userRouter.post("/register", async (req, res) => {
    const { name, email, mob_no, pass } = req.body;
    try {
        if (!name || !email || !mob_no || !pass) {
            return res.status(400).json({
                status: 400,
                message: "Please fill all the fields",
            });
        }

        const findUser = await UserModel.find({ email });
        if (findUser.length > 0) {
            return res.status(409).json({
                status: 409,
                message: "Your email is already registered. Please login!",
            });
        } else {
            bcrypt.hash(pass, Number(process.env.BYCRYPT_SALT_ROUND), async (err, hashPassword) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        status: 500,
                        message: "Something went wrong",
                    });
                } else {
                    const userData = new UserModel({ name, email, mob_no, "pass": hashPassword });
                    await userData.save();
                    return res.status(200).json({
                        status: 200,
                        message: "User registration successful",
                    });
                }
            })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: err,
        });
    }
});

userRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    try {
        if (email && pass) {
            const findUser = await UserModel.find({ email });
            if (findUser.length > 0) {
                bcrypt.compare(pass, findUser[0].pass, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({ "message": "Something went wrong", "status": 500 });
                    }

                    if (result) {
                        const token = jwt.sign({ "userId": findUser[0]._id }, process.env.JWT_SECRET_KEY);
                        return res.status(200).send({ "message": "Login successfull", "token": token, "name": findUser[0].name, "email": findUser[0].email, "status": 200 });

                    } else {
                        return res.status(403).send({ "message": "Wrong Password", "status": 403 });
                    }
                })
            } else {
                return res.status(404).send({ "message": "No account found with this email. Please Register", "status": 404 });
            }
        } else if (email && !pass) {
            res.send({ "message": "Please enter password" });
        } else {
            res.send({ "message": "Please enter email" });
        }
    } catch (err) {
        console.log(err);
        res.send({ "error": err });
    }
});

module.exports = { userRouter }
