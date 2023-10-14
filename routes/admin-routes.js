import express from "express";
import { addAdmin, getAdmin, loginAdmin } from "../controllers/admin-controller.js";
import fetchadmin from '../middleware/fetchadmin.js'
const AdminRouter = express.Router();

AdminRouter.post('/signup', addAdmin)
AdminRouter.post('/login', loginAdmin)
AdminRouter.get('/',fetchadmin, getAdmin)
export default AdminRouter