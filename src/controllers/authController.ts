import express, { Router } from 'express';
import { prisma } from '../prisma';
import bcrypt from 'bcrypt';
import { env } from 'process';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            return res.status(400).send({ error: "username required!" })
        }

        if (!password) {
            return res.status(400).send({ error: "password required!" })
        }

        const user = await prisma.user.findUnique({
            where:{
                username: username
            }
        })
        if (user){
            const sucess = await bcrypt.compare(password, user.password)
            if (sucess){
                if(env.SECRET_KEY && env.REFRESH_KEY){
                    const token = jwt.sign({userID: user.id, username: user.username}, env.SECRET_KEY, {expiresIn: 5});
                    const refreshToken = jwt.sign({userID: user.id, username: user.username} , env.REFRESH_KEY, {expiresIn: 60});
                    res.setHeader('authorization', token);
                    // res.cookie('refresh_token', refreshToken,{
                    //     maxAge: 3.154e10,
                    //     httpOnly: true
                    // });

                    return res.status(200).send({token, refreshToken,username:user.username})
                }
            }else{
                return res.status(400).send({error: "invalid password!"})
            }
        }else{
            return res.status(400).send({error: "user not found!"})
        }

    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = (app: any) => app.use("/auth", router);