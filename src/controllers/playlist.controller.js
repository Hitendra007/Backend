import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user._id;

    // Validate input parameters
    if (!name || !description) {
        throw new ApiError(401, 'Name and Description Required !!');
    }

    // Create a new playlist
    const newPlaylist = await Playlist.create({
        name,
        description,
        owner: new mongoose.Types.ObjectId(userId)
    });

    // Handle playlist creation failure
    if (!newPlaylist) {
        throw new ApiError(500, 'Internal server error, Playlist not created !! ');
    }

    res.status(200).json(new ApiResponse(200, newPlaylist, 'Playlist Created !!'));
});


const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Find playlists by owner ID
    const playlists = await Playlist.find({
        owner: new mongoose.Types.ObjectId(userId)
    });

    // Handle no playlists found
    if (!playlists || playlists.length === 0) {
        throw new ApiError(200, 'No playlists found!!');
    }

    res.status(200).json(new ApiResponse(200, playlists, 'Playlists fetched !!'));
});


const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // Validate input parameter
    if (!playlistId) {
        throw new ApiError(401, 'PlaylistId required !!');
    }

    // Find playlist by ID
    const playlist = await Playlist.findById(playlistId);

    res.status(200).json(new ApiResponse(200, playlist, 'Playlist fetched !!'));
});


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // Find the playlist by ID
    const playlist = await Playlist.findById(playlistId);

    // Handle playlist not found
    if (!playlist) {
        throw new ApiError(500, 'Playlist not found !!!');
    }

    // Add video to the playlist
    playlist.videos = [...playlist.videos, new mongoose.Types.ObjectId(videoId)];
    await playlist.save();

    res.status(200).json(new ApiResponse(200, 'Video added to playlist !!'));
});


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // Find the playlist by ID
    const playlist = await Playlist.findById(playlistId);

    // Handle playlist not found
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found !!!');
    }

    // Remove video from the playlist
    playlist.videos = playlist.videos.filter((video) => video.toString() !== videoId);
    await playlist.save();

    res.status(200).json(new ApiResponse(200, playlist, 'Video removed from playlist !!'));
});


const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // Delete the playlist by ID
    const playlist = await Playlist.findByIdAndDelete(playlistId);

    // Handle playlist not found
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found !!');
    }

    res.status(200).json(new ApiResponse(200, playlist, 'Playlist deleted Successfully !!'));
});


const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    // Update the playlist by ID
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                description,
                name
            }
        },
        {
            new: true
        }
    );

    // Handle playlist not found
    if (!playlist) {
        throw new ApiError(404, 'Playlist not found !!');
    }

    res.status(200).json(new ApiResponse(200, playlist, 'Playlist updated !!'));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
};
