import AdminSchemaModel from "../models/Admin.js"
import MovieSchemaModel from "../models/Movie.js"
import mongoose, { mongo } from "mongoose"

export const addMovie = async (req, resp) => {
    const { title, description, releaseDate, posterUrl, featured, stars} = req.body

    try {
        const movieExist = await MovieSchemaModel.exists({ title, releaseDate })
        if (movieExist) {
            return resp.status(200).json({ message: "Movie already Exist" })
        }
        else {
            const newMovie = new MovieSchemaModel({
                admin: req.adminId,
                title, description, releaseDate, posterUrl, featured, stars
            })

            const session = await mongoose.startSession();
            const adminUser = await AdminSchemaModel.findById(req.adminId)
            session.startTransaction();
            await newMovie.save({session})
            adminUser.addmovies.push(newMovie)
            await adminUser.save({session})
            session.commitTransaction();

            resp.status(200).json({ message: "Movie Added", newMovie })
        }
    }
    catch (error) {
        resp.status(500).json({ err: error.message })
    }
}

export const getAllmovie = async (req, resp) => {
    const allmovie = await MovieSchemaModel.find({})
    try {
        if (!allmovie)
            return resp.status(500).json({ message: "No movie in Db" });
        else
            return resp.status(200).json(allmovie)
    }
    catch (error) {
        resp.status(500).json({ err: error.message })
    }
}   

export const getMovieById = async(req, resp)=> {
    const movieId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return resp.status(400).json({ message: "Invalid movieId format" });
    }

    try{
        const movie = await MovieSchemaModel.findById(movieId)
        if(!movie){
            return resp.status(500).json({message : "Movie with this Id in not in Db"})
        }   
        return resp.status(200).json({message: "Movie found in Db", movie})
    }
    catch(error){
        resp.status(500).json({message : error.message})
    }
}

export const deleteMovieById = async (req, res) => {
    const movieId = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid movieId format" });
    }
  
    try {
      // Find and delete the movie by its ID
      const deletedMovie = await MovieSchemaModel.findByIdAndDelete(movieId);
  
      if (!deletedMovie) {
        return res.status(404).json({ message: "Movie with this ID is not in the database" });
      }
      return res.status(200).json({ message: "Movie deleted successfully", deletedMovie });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(err.message)
    }
}
  