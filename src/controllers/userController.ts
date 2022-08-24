import express, { Router } from 'express';
import { prisma } from '../prisma';

const router = express.Router();
// return all users
router.get("/", async(req, res)=>{
    try{
        const all = prisma.user.findMany({select:{password:false}})
        return res.status(200).send(all)
    }catch(e){
        return res.status(400).send(e)
    }
});

router.post("/signup", async(req, res) =>{
    try{
        const {username, password} = req.body;
        const user = await prisma.user.create({
            data:{
                username,
                password
            }
        })
        return res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = (app:any) => app.use("/user",router);