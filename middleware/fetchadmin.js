// import express from 'express'
import jwt from 'jsonwebtoken'
import 'dotenv/config.js'

const fetchadmin = (req, resp, next)=> {
    const token = req.header('Authorization')

    if (!token) {
        return resp.status(401).json({ message: 'Authorization token is missing' });
    }

    try{
        const {userId} = jwt.verify(token, process.env.JWT_SECERET_KEY)
        req.adminId = userId;
        console.log('Fetched Admin', userId)

        next()
    }
    catch(error){
        resp.status(400).json({err : error.message})
    }
}

export default fetchadmin