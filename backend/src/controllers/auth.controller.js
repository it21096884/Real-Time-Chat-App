import { generatejwtToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';

//signup controller
export  const  signup = async (req,res)=>{
    const {fullName,email,password}=req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:'All fields are required'});
        }
        if(password.length<6){
            return res.status(400).json({message:'Password must be at least 6 characters'});
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:'User already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email, 
            password:hashedpassword
        })
       if(newUser){
        //generate jwt token
        generatejwtToken(newUser._id,res);
        newUser.save();
        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
        })

       }else{
              return res.status(400).json({message:'User not created'});
       } 
    } catch (error) {
        console.log("Error in sign up controller",error);
        res.status(500).json({message:'Internal server error'});
    }
}

//login controller
export const login = async (req,res)=>{
    const {email,password} = req.body;
try {
     if(!email || !password){
        return res.status(400).json({message:'All fields are required'});
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"Invalid credentials"});
    }
    const isPasswordMatch = await bcrypt.compare(password,user.password);
    if(!isPasswordMatch){
        return res.status(400).json({message:"Invalid credentials"});
    }

    //generate jwt token
    generatejwtToken(user._id,res);
    res.status(200).json({
        _id:user._id,
        Firstname:user.Firstname,
        email:user.email,
        profilePic:user.profilePic,
    })

} catch (error) {
    console.log("Error in login controller",error);
    res.status(500).json({message:'Internal server error'});
}
   
}

//logout controller
export const logout =(req,res)=>{
    try {
        
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:'Logged out successfully'});
       
    } catch (error) {
        console.log("Error in Loout controller",error);
        res.status(500).json({message:'Internal server error'});

    }
}

//update profile controller
export const updateProfile = async (req,res)=>{
    try {
        const {profilePic}=req.body;
        const UserId = req.user._id;
        //if profile pic is not provided
        if(!profilePic){
            return res.status(400).json({message:'Profile picture is required'});
        }
        //upload image to cloudinary
       const UploadResponse = await cloudinary.uploader.upload(profilePic)
       //update the data base
       const UpdateProfilePic = await User.findByIdAndUpdate(UserId,{profilePic:UploadResponse.secure_url},{new:true});

       res.status(200).json(UpdateProfilePic);
    } catch (error) {
        console.log("Error in update profile controller",error);
        res.status(500).json({message:'Internal server error'});
    }
}

//happens when the page is refreshed check the user is still logged in and authenticated
export const checkAuth = async (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check auth controller",error.message);
        res.status(500).json({message:'Internal server error'});
    }

};