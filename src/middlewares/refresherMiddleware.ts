import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { env } from "process";

export const refresher = (
    req: Request,
    res: Response,
    next: NextFunction
)=> {
    const accessToken = req.headers['authorization'];
    const {refresh_token} = req.body;
    if(!accessToken){
        return next();
    }

    if (refresh_token && accessToken && env.SECRET_KEY){
        jwt.verify(accessToken, env.SECRET_KEY,(err,decoded)=>{
            if(err) {
                if(err.name == 'TokenExpiredError' && env.REFRESH_KEY && env.SECRET_KEY){
                    console.log("expirou!")
                    try{
                        const refresh_valid = jwt.verify(refresh_token,env.REFRESH_KEY)
                        if (refresh_valid){
                            console.log("token Expirado")
                            const newToken = jwt.sign({decoded}, env.SECRET_KEY, {expiresIn: 300});
                            req.headers['authorization'] = newToken; 
                            console.log(newToken);
                            console.log("Novo token gerado");
                        }
                    }catch(e){
                        res.send({erro:"refresh token expired please signin again"}).end();
                    }
                }
            }
            next();
        })
    }



}