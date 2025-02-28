import jwt from 'jsonwebtoken';
export const generatejwtToken = (userId,res)=>{

    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'7d'
    });

    res.cookie("jwt",token,{
        httpOnly:true,//prevents xss attachs
        sameSite: "Strict", //prevents csrf attacks
        secure:process.env.NODE_ENV !== 'development',
        maxAge:7*24*60*60*1000 //MS
    });

    
    return token;
}