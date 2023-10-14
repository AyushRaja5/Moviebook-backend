import BookingModelSchema from "../models/Booking.js"
import UserSchemaModel from "../models/User.js"
import MovieSchemaModel from '../models/Movie.js'
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"
import 'dotenv/config.js'
import mongoose from "mongoose"
export const userController = async (req, resp) => {
    const userId = req.userId
    try {
        const users = await UserSchemaModel.find({})
        if (!users || users.length===0)
            resp.status(500).json({ message: "Users Not Found" })
        
        const authenticatedUser = users.find((user) => user._id.toString() === userId);
        
        if (!authenticatedUser) {
            return resp.status(400).json({ message: "User not Authenticate" });
        }
        return resp.status(200).json({ user : authenticatedUser });
    }
    catch (err) {
        resp.json({ error: err.message })
    }
}

export const signup = async (req, resp) => {
    try {
        const { name, email, password } = req.body;
        if (!email.includes('@'))
            return resp.status(500).json({ message: "Enter Valid Email" })

        if (email.trim() === "" || password.trim() === "" || name.trim() === "") {
            return resp.status(500).json({ message: "Email, password, and name are required fields" });
        }
        const userexist = await UserSchemaModel.findOne({ email })

        // If User Exist in db
        if (userexist) {
            console.log("User already exists");
            return resp.status(500).json({ message: "User already exists" });
        }

        // Check validation for email || password || name
        if (!email.includes('@'))
            return resp.status(500).json({ message: "Enter Valid Email" })
        // if (email.trim() === "" || password.trim() === "" || name.trim() === "") {
        //     return resp.status(500).json({ message: "Email, password, and name are required fields" });
        // }

        // Bcrypting password || Hashing Password
        const salt = bcryptjs.genSaltSync(10) // bigger the round value the better the password
        const hashedPassword = bcryptjs.hashSync(password, salt)

        // creating new User
        const newUser = new UserSchemaModel({
            name, email, password: hashedPassword
        })

        // Saving new User to database
        await newUser.save()
        resp.status(200).json({ message: "User registered successfully", newUser });
    }
    catch (err) {
        resp.status(400).json({ error: err.message })
        console.log(err)
    }
}

export const updateUser = async (req, resp) => {
    const { id } = req.params
    const { name, email, password } = req.body;
    const userId = req.userId
    // Validation 
    if (!email.includes('@'))
        return resp.status(400).json({ message: "Enter Valid Email" })

    if (email.trim() === "" || password.trim() === "" || name.trim() === "") {
        return resp.status(400).json({ message: "Email, password, and name are required fields" });
    }
    // Bcrypting password || Hashing Password
    const salt = bcryptjs.genSaltSync(10) // bigger the round value the better the password
    const hashedPassword = bcryptjs.hashSync(password, salt)

    try {
        const updatedUser = await UserSchemaModel.findByIdAndUpdate(id, {
            name, email, password: hashedPassword
        }, { new: true }) // it will return the new and updated value

        if (!updatedUser) {
            return resp.status(500).json({ message: "User not found" });
        }
        if(updateUser._id.toString() !== userId)
            return resp.status(500).json({message : "User not Authenticated"})
        
        console.log({ updatedUser })
        resp.status(200).json({ message: "User Data Updated", updatedUser });
    }
    catch (error) {
        resp.status(500).json({ err: error.message })
        console.log(err);
    }
}

export const deleteUser = async (req, resp) => {
    const { id } = req.params
    const userId = req.userId
    try {
        const usertodelete = await UserSchemaModel.findById(id);

        if (!usertodelete)
            return resp.status(500).json({ message: "User note found" })

        if(usertodelete._id.toString() !== userId)
            return resp.status(500).json({message : "User not Authenticated"})
        
        const bookingIdsArr = usertodelete.bookings // array of bookig id associated with the User

        const session = await mongoose.startSession() // Session Started
        session.startTransaction();
        await UserSchemaModel.findByIdAndDelete(id).session(session);

        for (const bookingId of bookingIdsArr) {
            const bookingToDelete = await BookingModelSchema.findById(bookingId);
            if (bookingToDelete) {
                await BookingModelSchema.findByIdAndDelete(bookingId).session(session);
                // Find the associated movie and remove the booking ID
                const movieId = bookingToDelete.movie;
                const movieToUpdate = await MovieSchemaModel.findById(movieId);
                if (movieToUpdate) {
                    movieToUpdate.bookings.pull(bookingId);
                    await movieToUpdate.save({ session });
                }
            }
        }
        session.commitTransaction();

        resp.status(200).json({ message: "User Deleted", usertodelete })
    }
    catch (error) {
        resp.status(500).json({ err: error.message })
    }
}

export const loginUser = async (req, resp) => {
    const { email, password } = req.body

    try {
        if (!email || !password)
            return resp.status(500).json({ message: "Please Enter both fields" });

        const findUser = await UserSchemaModel.findOne({ email });

        if (!findUser) return resp.status(500).json({ message: "User not found with this E-mail" })

        const checkpassword = await bcryptjs.compare(password, findUser.password)

        if (!checkpassword) return resp.status(500).json({ message: "Please enter correct password" })

        const token = jwt.sign({ userId: findUser._id }, process.env.JWT_USER_SECERET_KEY, {
            expiresIn: '1d', // Set the token expiration time as needed
        });

        resp.status(200).json({ message: "Password Matched, Logged In User", token })
    }
    catch (error) {
        resp.status(400).json({ err: error.message })
    }
}

export const getBookedMovie = async(req, resp) => {
    const {id} = req.params
    if (!mongoose.isValidObjectId(id)) {
        return resp.status(400).json({ message: 'Invalid user ID' });
    }
    const userId = req.userId;
    try{
        const user = await UserSchemaModel.findById(id);
        if (!user) {
            return resp.status(404).json({ message: 'User not found' });
        }
        if (user._id.toString() !== userId) {
            return resp.status(401).json({ message: 'User not authenticated' });
        }

        const bookings = await BookingModelSchema.find({user : id});

        if(!bookings || bookings.length===0){
            return resp.status(500).json({message : "User has made no Bookings"})
        }
        if(id !== userId)
            return resp.status(500).json({message : "User not Authenticated"})

        resp.status(200).json({message : "Here are the movie that user booked", bookings})
    }
    catch(error){
        resp.status(500).json({err : error.message})
    }
}

