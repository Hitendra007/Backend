import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getPlaylistById,getUserPlaylists,createPlaylist,addVideoToPlaylist,removeVideoFromPlaylist,deletePlaylist,updatePlaylist } from "../controllers/playlist.controller";
import { Router } from "express";
const router = Router()

router.use(verifyJWT)


export default router;