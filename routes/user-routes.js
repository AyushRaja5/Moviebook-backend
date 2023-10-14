import express from 'express'
import {userController, signup, updateUser, deleteUser, loginUser, getBookedMovie } from '../controllers/user-controller.js';
import fetchUser from '../middleware/fetchuser.js';

const userRouter = express.Router();

userRouter.get('/', fetchUser,userController)
userRouter.post('/signup', signup)
userRouter.put('/update/:id', fetchUser ,updateUser)
userRouter.delete('/delete/:id', fetchUser ,deleteUser)
userRouter.get('/getmovie/:id', fetchUser ,getBookedMovie)

// Login User
userRouter.post('/login', loginUser)


export default userRouter;