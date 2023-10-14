import express from "express";
import { addMovie, deleteMovieById, getAllmovie, getMovieById } from "../controllers/movie-controller.js";
import fetchadmin from "../middleware/fetchadmin.js";
const movieRouter = express.Router()


// movieRouter.use(fetchadmin)

movieRouter.post('/addmovie', fetchadmin, addMovie)
movieRouter.get('/getallmovies', getAllmovie)
movieRouter.get('/getmovie/:id', getMovieById)
movieRouter.delete('/deletemovie/:id', fetchadmin,deleteMovieById)
export default movieRouter