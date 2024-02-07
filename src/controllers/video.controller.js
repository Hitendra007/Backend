import { Video } from '../models/video.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { deleteFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js'
import mongoose from 'mongoose'
const getAllVideos = asyncHandler(async (req, res) => {
    console.log('endpoint hit');

    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    if (!userId) {
        throw new ApiError(401, 'Send userId');
    }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    let output = {};

    let aggregate = Video.aggregate();

    // Add conditions to the aggregation pipeline based on parameters
    if (userId) {
        aggregate.match({ owner: new mongoose.Types.ObjectId(userId) });
    }

    // Add more conditions based on other parameters if needed

    try {
        // Await the result of Video.aggregatePaginate
        const result = await Video.aggregatePaginate(aggregate, options);
        output = result;
    } catch (err) {
        throw new ApiError(404, 'Not found !!');
    }

    res.status(200).json(new ApiResponse(200, output, 'Videos Fetched !!'));
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user._id;
    console.log("userId:", userId)
    let videoFilePath = "";
    let thumbnailPath = "";

    // Check and set videoFilePath if it exists
    if (req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0) {
        videoFilePath = req.files.videoFile[0].path;
    }

    // Check and set thumbnailPath if it exists
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailPath = req.files.thumbnail[0].path;
    }

    // Check required fields
    if (!title || !description || !userId || !videoFilePath || !thumbnailPath) {
        throw new ApiError(401, "Didn't get userId or title or description or videoFilePath or thumbnailPath");
    }

    // Check if videoFilePath is empty
    if (videoFilePath === "") {
        throw new ApiError(401, 'videoFile required !!');
    }

    // Upload files to Cloudinary
    const videoFile = await uploadOnCloudinary(videoFilePath);
    const thumbnailFile = await uploadOnCloudinary(thumbnailPath);

    // Check if videoFile upload failed
    if (!videoFile) {
        throw new ApiError(401, 'Failed to upload videoFile to Cloudinary');
    }
    console.log(videoFile, "   =======     ", thumbnailFile)
    // Create a new video record
    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnailFile?.url || '',
        duration: videoFile?.duration || 0,
        owner: userId
    });

    res.status(200).json(new ApiResponse(200, video, 'Video published !!'));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(401, 'videoId required !!')
    }
    const video = await Video.findById(videoId)
    res.status(200).json(new ApiResponse(200, video ?? 'No videos found', 'Video Fetched !!'))

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnail = req.file.path
    if (!title || !description) {
        throw new ApiError(401, 'title and description and thumbnail required !!')
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, 'video not found !!')
    }

    const thumbnailupload = await uploadOnCloudinary(thumbnail)
    if (!thumbnailupload) {
        throw new ApiError(500, 'thumbnail upload failed !!')
    }

    video.title = title
    video.description = description
    video.thumbnail = thumbnailupload?.url
    await video.save();
    res.status(200).json(new ApiResponse(200, video, 'video updated successfully !!'))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(401, 'videoId required !!')
    }
    const deletedVideo = await Video.findByIdAndDelete(videoId)
    if (!deletedVideo) {
        throw new ApiError(404, 'Video not found in db try again')
    }
    const deleteVideo = await deleteFromCloudinary(deletedVideo.videoFile)
    const deletethumbnail = await deleteFromCloudinary(deletedVideo.thumbnail)
    console.log(deleteVideo, "---------", deletethumbnail)
    res.status(200).json(new ApiResponse(200, deletedVideo, 'Video deleted successfully'))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Find the video by its _id
    const existingVideo = await Video.findById(videoId);

    if (!existingVideo) {
        throw new ApiError(404, 'Video not found');
    }

    // Toggle the isPublished field
    const newPublishStatus = !existingVideo.isPublished;

    // Use findByIdAndUpdate to update the document
    const updatedStatusVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: { isPublished: newPublishStatus }
        },
        { new: true }
    );

    if (updatedStatusVideo) {
        // console.log('Toggled publish status:', updatedStatusVideo);
        res.status(200).json(new ApiResponse(200, updatedStatusVideo, 'Publish status toggled successfully'));
    }
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}