import { catchAsyncError } from '../middleware/catchAsyncError.js';
import ErrorHandler from '../middleware/error.js';
import { User } from '../models/User.js';
import { sendToken } from '../utils/jwtToken.js';

//user registration

export const register = catchAsyncError(async(req,res,next)=>{
    const {name ,email,phone,role,password}=req.body;
    if(!name ||!email ||!phone ||!role ||!password){
        return next(new ErrorHandler("Please fill full registration form!", 400));

    }
    const isEmail =await User.findOne({email});
    if(isEmail){
        return next(new ErrorHandler("Email already exists", 400));
    }

    const user = await User.create({
        name,
        email,
        phone,
        role,
        password,
    });
    sendToken(user,200,res,"User Registered Sucessfully!");

});


//registered user login

export const login = catchAsyncError(async(req,res,next)=>{
    const {email,password,role}=req.body;

    if(!email||!password ||!role){
        return next(new ErrorHandler("Please provide email, password, and role", 400));
        
    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Please provide email,password and role",400))
    }
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 400)); //just for safety of user email we are printing this
    }
    if(user.role!== role){
        return next(new ErrorHandler("User with this role not found", 400));
    }
    sendToken(user,200,res,"User logged in sucessfully!")

});

// logout user

export const logout = catchAsyncError(async (req, res, next) => {
    res
        .status(200)
        .cookie("token", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "User Logged Out Successfully!",
        });
});



