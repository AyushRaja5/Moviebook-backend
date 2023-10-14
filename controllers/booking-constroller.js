import mongoose, { mongo } from "mongoose";
import BookingModelSchema from "../models/Booking.js";
import MovieSchemaModel from "../models/Movie.js";
import UserSchemaModel from '../models/User.js'

export const bookMovie = async (req, resp) => {
    const { movieId } = req.params
    const { date, seat } = req.body;
    const userId = req.userId;
    console.log("user id" , userId)
    try {
        const selectedMovie = await MovieSchemaModel.findById(movieId);
        const selectedUser = await UserSchemaModel.findById(userId);

        if (!selectedMovie || !selectedUser) {
            return resp.status(404).json({ message: "Movie or User not found" });
        }
        if(selectedUser._id.toString() !== req.userId) 
            return resp.status(500).json({message : "User Is Not Authenticated"});
        const newBooking = new BookingModelSchema({
            movieTitle: selectedMovie.title,
            movie: movieId, // 'movie' to match the schema field name
            user : userId,
            date: new Date(date), // Parse date directly
            seat
        });

        const session = await mongoose.startSession();
        session.startTransaction();
        selectedUser.bookings.push(newBooking);
        selectedMovie.bookings.push(newBooking);
        await selectedUser.save({ session });
        await selectedMovie.save({ session });
        await newBooking.save({ session });
        session.commitTransaction();

        resp.status(200).json({ message: `Movie Add by ${userId}`, booking: newBooking })

    } catch (error) {
        resp.status(500).json({ err: error.message })
    }
}

export const getBookingbyId = async (req, resp) => {
    const { bookingId } = req.params;
    const userId = req.userId
    if (!mongoose.isValidObjectId(bookingId)) {
        return resp.status(400).json({ message: 'Invalid bookingId' });
    }
    try {
        const bookingInfo = await BookingModelSchema.findById(bookingId);
        if (!bookingInfo)
            return resp.status(500).json({ message: "Booking with this id is not available" })
        if(bookingInfo.user.toString() !== userId)
            return resp.status(500).json({message : "User not Authenticate"})
        
        return resp.status(200).json({ bookingInfo })
    }
    catch (error) {
        resp.status(500).json({ err: error.message })
    }
}

export const deleteBooking = async (req, resp) => {
    const { bookingId } = req.params;
    const userId = req.userId;
    if (!mongoose.isValidObjectId(bookingId)) {
        return resp.status(400).json({ message: 'Invalid bookingId' });
    }
    try {
        const bookingTodelete = await BookingModelSchema.findById(bookingId)
        if (!bookingTodelete) {
            return resp.status(200).json({ message: "Booking with this bookingId is not available" })
        }
        if(bookingTodelete.user.toString() !== userId)
            return resp.status(500).json({message : "User Not allowed to delete"})
        
        const session = await mongoose.startSession();

        session.startTransaction()
        await UserSchemaModel.findByIdAndUpdate(bookingTodelete.user, {
            $pull : {bookings : bookingId}
        }).session(session);
        
        await MovieSchemaModel.findByIdAndUpdate(bookingTodelete.movie, {
            $pull : {bookings : bookingId}
        }).session(session)
        await BookingModelSchema.findByIdAndDelete(bookingId).session(session);
        
        session.commitTransaction()

        return resp.status(200).json({ message: 'Booking deleted', deleteBooking: bookingTodelete })
    }
    catch (error) {
        resp.status(500).json({ err: error.message })
    }

}