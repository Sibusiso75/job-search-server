// const jwt = require("jsonwebtoken")

// function verifyToken(req,res,next){
//     const authorization = req.cookies.employerToken;
//     if(authorization){
//         jwt.verify(authorization, process.env.KEY, (err,user)=>{
//             if(err){
//                 return res.json({message:"Token is invalid"})
//             }
//             req.user =user
//             next()
//         })
//     }
//     else{
//         return res.json({message:"You are not authenticated"})
//     }
// }
// function verifyTokenAndAuthorization(req,res,next){
//     verifyToken(req,res,()=>{
//         if(req.user.id===req.params.id || req.user.isAdmin){
//             next()
//         }
//         else{
//             return res.json({message:"You can't access that info"})
//         }
//     })
// }
// function verifyAdmin(req, res, next){
//     verifyToken(req,res, ()=>{
//         if(req.user.isAdmin){
//             next()
//         }
//         else{
//             return res.json({message:"You are not an admin"})
//         }
//     })
// }

// module.exports= {verifyToken, verifyTokenAndAuthorization,verifyAdmin}