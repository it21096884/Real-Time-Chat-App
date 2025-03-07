import express from 'express';
import { protectRoute } from '../middlwares/auth.middleware.js';
import { getMessages, getUserForSideBar, sendMessage } from '../controllers/message.controller.js';


const router = express.Router();

//get the users at the application
router.get('/users',protectRoute,getUserForSideBar);
router.get("/:id",protectRoute,getMessages);
router.post("send/:id",protectRoute,sendMessage);

export default router;