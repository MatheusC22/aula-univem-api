import express, { Router } from 'express';
import { prisma } from '../prisma';
import bcrypt from 'bcrypt';
import { env } from 'process';
import jwt from 'jsonwebtoken';
import { validateToken } from '../middlewares/validadeTokenMiddleware';

const router = express.Router();
// return all users
router.get("/", validateToken, async (req, res) => {
    try {
        const all = await prisma.user.findMany({ select: { username: true, createdAt: true, updatedAt: true } })
        return res.status(200).send(all)
    } catch (e) {
        return res.status(400).send(e)
    }
});
//return user by username
router.get("/:_username", validateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { username: req.params._username }, select: { username: true, createdAt: true, updatedAt: true } })

        if (!user)
            return res.status(404).send({ error: 'user not found' })

        return res.status(200).send(user);
    } catch (e) {
        return res.status(400).send({ e })
    }
})

router.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            return res.status(400).send({ error: "username required!" })
        }

        if (!password) {
            return res.status(400).send({ error: "password required!" })
        }

        const check = await prisma.user.findUnique({
            where: { username: username }
        });
        if (check) {
            return res.status(400).send({ error: "User Already exist!" })
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const user = await prisma.user.create({
            data: {
                username,
                password: hash
            }, select: {
                username: true,
                createdAt: true,
                updatedAt: true
            }
        })
        return res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.put("/update/:_username", validateToken, async (req, res) => {
    try {
        const { username, password } = req.body;
        const old_user = req.params._username

        const check = await prisma.user.findUnique({
            where: { username: username }
        });
        if (check) {
            return res.status(400).send({ error: "User Already exist!" })
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const updatedUser = await prisma.user.update({
            where: {
                username: old_user
            },
            data: {
                username: username,
                password: hash
            }, select: { username: true, createdAt: true, updatedAt: true }
        })

        return res.status(200).send({ updatedUser });

    } catch (e) {
        return res.status(400).send(e)
    }
});

module.exports = (app: any) => app.use("/user", router);