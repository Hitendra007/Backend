import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation - not incorrect format
    // check if user already exist
    //check for images ,check for avatar
    //upload them to cloudinary,avatar
    //create user object - create entry in db 
    //remove password and refresh token from response
    //check for user creation
    //return response
    const { fullName, email, username, password } = req.body
    console.log("email:", email)
    if (!fullName || !email || !username || !password) {
        throw new ApiError(400, "All fields are required !!")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const CoverImage = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Internal server error")

    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    )

})
export { registerUser }