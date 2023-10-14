import express from 'express'
import { bookMovie, getBookingbyId, deleteBooking } from '../controllers/booking-constroller.js'
import fetchUser from '../middleware/fetchuser.js'

const bookingRouter = express.Router()

bookingRouter.post('/bookingMovie/:movieId', fetchUser ,bookMovie)
bookingRouter.get('/bookingMovie/:bookingId', fetchUser,getBookingbyId)
bookingRouter.delete('/deletebooking/:bookingId', fetchUser,deleteBooking)

export default bookingRouter