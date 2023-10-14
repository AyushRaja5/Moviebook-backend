import jwt from 'jsonwebtoken'
import 'dotenv/config.js'

const fetchUser = (req, resp, next)=> {
    const token = req.header('Authorization')
    
    if (!token) {
        return resp.status(401).json({ message: 'Authorization token is missing' });
    }

    try{
        const {userId} = jwt.verify(token, "" + process.env.JWT_USER_SECERET_KEY)
        req.userId = userId;
        console.log('Fetched Admin', userId)
        // console.log("User Auth : " ,token);
        next()
    }
    catch(error){
        resp.status(400).json({err : error.message})
    }
}

export default fetchUser