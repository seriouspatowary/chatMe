import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUsersForSidebar,getMessage,sendMessage  } from '../controllers/message.controller.js';


const router = express.Router();


router.get("/users", protectRoute, getUsersForSidebar)

router.get("/getmessage/:userToChatid", protectRoute, getMessage);

router.post("/send/:id",protectRoute,sendMessage)

export default router;