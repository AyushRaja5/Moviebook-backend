import AdminSchemaModel from "../models/Admin.js";
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken";
import 'dotenv/config.js'


export const addAdmin = async (req, resp) => {
    const { name, email, password } = req.body;
    try {
        if (!email.includes('@'))
            return resp.status(400).json({ message: "Enter Valid Email" })

        if (email.trim() === "" || password.trim() === "" || name.trim() === "") {
            return resp.status(400).json({ message: "Email, password, and name are required fields" });
        }
        const findAdmin = await AdminSchemaModel.findOne({ email })

        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(password, salt);

        if (findAdmin)
            return resp.status(500).json({ message: "Admin Already Exist with this email" })

        else {
            const newAdmin = new AdminSchemaModel({
                name, email, password: hashedPassword
            })

            await newAdmin.save()
            resp.status(200).json({ message: "Admin Sign Up successful", newAdmin })
        }
    }
    catch (error) {
        resp.status(500).json({ err: error.message })
    }
}

export const loginAdmin = async (req, resp) => {
    const { email, password } = req.body;

    try {
        if (email.trim() === "" || password.trim() === "") {
            return resp.status(400).json({ message: "Email & password are required fields" });
        }
        if (!email.includes('@'))
            return resp.status(400).json({ message: "Enter Valid Email" })

        const adminExist = await AdminSchemaModel.findOne({ email })

        if (adminExist) {
            const matchpassword = bcryptjs.compareSync(password, adminExist.password)
            if(matchpassword) {
                const token = jwt.sign({userId : adminExist._id}, process.env.JWT_SECERET_KEY,{
                    expiresIn : '1d'
                })
                resp.status(200).json({message : "Login Admin Successfull",adminExist, token})
            }
            else resp.status(400).json({message : "Wrong Password"})
        }
        else{
            return resp.status(200).json({message : "Admin not exist with this Email"})
        }
    }
    catch (error) {
        resp.status(500).json({ err: error.message })
    }
}

export const getAdmin = async(req, resp) =>{
    const adminId = req.adminId;
    console.log("Admin Id hai : ",adminId)
    try {
        const admin = await AdminSchemaModel.find({})
        if (!admin || admin.length===0)
            resp.status(500).json({ message: "Admin Not Found" })
        
        const authenticatedAdmin = admin.find((user) => user._id.toString() === adminId);
        
        if (!authenticatedAdmin) {
            return resp.status(400).json({ message: "Admin not Authenticate" });
        }
        return resp.status(200).json({ admin : authenticatedAdmin });
    }
    catch (err) {
        return resp.status(500).json({ error: err.message });
    }
}

// export const myuploads = async(req, resp) => {

// }