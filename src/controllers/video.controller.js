import { Video } from '../models/video.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
const getAllVideos = asyncHandler(async (req, res) => {
    console.log('endpointhitted')
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    if (!userId) {
        throw new ApiError(401, 'send UserId')
    }
    const options = {
        page: page,
        limit: limit,
    };
    let output = {}
    let aggregate = Video.aggregate();
    Video.aggregatePaginate(aggregate, options).then((result) => {
        console.log(result)
    }).catch((err) => {
        throw new ApiError(404, 'Not found !!')
    })
    res.status(200).json(new ApiResponse(200, output, "videos Fetched !!"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user._id;
    console.log("userId:",userId)
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
    console.log(videoFile,"   =======     ",thumbnailFile)
    // Create a new video record
    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnailFile?.url || '',
        duration: 10,
        owner: userId
    });

    res.status(200).json(new ApiResponse(200, 'Video published !!'));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

const updateVideo = asyncHandler((req, res) => {
    const { videoId } = req.params
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})
export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}