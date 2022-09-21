import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { env } from "process";

export const validateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) =>{
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token || !env.SECRET_KEY) {
        return res.sendStatus(401);
    }

    jwt.verify(token, env.SECRET_KEY, (err,decoded)=>{
        if(err) return res.status(401).send(err).end()
    });
    
    next();
}