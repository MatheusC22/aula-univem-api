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
                if(env.SECRET_KEY){
                    var token = jwt.sign({userID: user.id}, env.SECRET_KEY, {expiresIn: 300});
                    return res.status(200).send({token, username:user.username})
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