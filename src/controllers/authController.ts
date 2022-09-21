import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import { env } from 'process';
import { prisma } from '../prisma';

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

                    return res.status(200).send({token })
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