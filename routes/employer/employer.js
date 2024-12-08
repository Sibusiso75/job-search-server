const express = require("express")
const router = express.Router()
const Employer = require("../../models/Employer/Employer")
const {verifyToken,verifyTokenAndAuthorization,verifyAdmin} = require("../verifyToken")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const Token = require("../../models/JobSeeker/token")
// const sendEmail = require("../../utilis/sendEmail")


const highestQualification =["Grade 12", "Grade 11","Grade 10", "Higher Certificate","Diploma","Degree","Masters", "PHD"]
// router.get("/users", (request, response)=>{
//     response.status(200).json([{id:1,jobTitle:"Software Developer",province:"Eastern Cape",suburb:"Kwa-Nobuhle",postalCode:6242,phoneNumber:27631008729,highestQualification:highestQualification[3],age:27,username:"Sibusiso Matebese", gender:"Male",email:"sibusisomatebese75@gmail.com", isAdmin:"Yes", password:"*************",
// }
//   , {id:2,jobTitle:"Software Developer",province:"Eastern Cape",suburb:"Kwa-Nobuhle",postalCode:6242,phoneNumber:27624192299,highestQualification:highestQualification[4],age:27,username:"Sthera Tini", gender:"Male",email:"stheratini15@gmail.com", isAdmin:"No", password:""},
//   {id:3,jobTitle:"Business Analyst",province:"Eastern Cape",suburb:"Kwa-Nobuhle",postalCode:6242,phoneNumber:27787017510,highestQualification:highestQualification[3],age:22,username:"Cindy Baba", gender:"Female",email:"sindisiwebaba@gmail.com", isAdmin:"No", password:"***"},
//   {id:4,jobTitle:"Cashier",province:"Eastern Cape",suburb:"Kwa-Nobuhle",postalCode:6242,phoneNumber:27744973315,highestQualification:highestQualification[4],age:25,username:"Nwabisa Mbunge", gender:"Female",email:"nwabisambunge12@gmail.com", isAdmin:"No", password:"**********"},
//   {id:5,jobTitle:"Business Analyst",province:"Eastern Cape",suburb:"Kwa-Nobuhle",postalCode:6242,phoneNumber:27791516405,highestQualification:highestQualification[5],age:24,username:"Bulelwa Cakwebe", gender:"Female",email:"bulelwacakwebe12@gmail.com", isAdmin:"No", password:"*********"},
//   {id:6,jobTitle:"Teacher",province:"Eastern Cape",suburb:"Kwa-Nobuhle",postalCode:6242,phoneNumber:27713165825,highestQualification:highestQualification[5],age:32,username:"Siyasanga Dobela", gender:"Male",email:"siyasangadobela2@gmail.com", isAdmin:"No", password:"************"},
//   {id:7,jobTitle:"Sound Engineer",province:"Eastern Cape",suburb:"Kwa-Nobuhle",postalCode:6242,phoneNumber:27716465182,highestQualification:highestQualification[3],age:25,username:"Phumelela Platjiees", gender:"Male",email:"phumelelaplatjiees202@gmail.com", isAdmin:"No", password:"********"}
//   ])
//   })

// router.get("/users",verifyAdmin, (request, response)=>{
//   response.status(200).json([{id:1,age:27,username:"Sibusiso Matebese", gender:"Male",email:"sibusisomatebese75@gmail.com", isAdmin:"Yes", password:"*************"}
// , {id:2,age:27,username:"Sthera Tini", gender:"Male",email:"stheratini15@gmail.com", isAdmin:"No", password:""},
// {id:3,age:25,username:"Kevin de Bruyne", gender:"Male",email:"kevindebruyne@gmail.com", isAdmin:"No", password:"***"},
// {id:4,age:25,username:"Nwabisa Mbunge", gender:"Female",email:"nwabisambunge12@gmail.com", isAdmin:"No", password:"**********"},
// {id:5,age:24,username:"Bulelwa Cakwebe", gender:"Female",email:"bulelwacakwebe12@gmail.com", isAdmin:"No", password:"*********"},
// {id:6,age:32,username:"Siyasanga Dobela", gender:"Male",email:"siyasangadobela2@gmail.com", isAdmin:"No", password:"************"},
// {id:7,age:25,username:"Phumelela Platjiees", gender:"Male",email:"phumelelaplatjiees202@gmail.com", isAdmin:"No", password:"********"}


// ])
// })
//Registration - POST REQUEST
router.post("/employerRegister", async (req, res)=>{
    try {
        const {username, email, password,phoneNumber,companyName,numberOfEmployees,aboutYourCompany }=req.body;
    const employer = await Employer.findOne({email})
    
  
          if(employer){
              return res.json({message:"User already exists"})
          } 

        
        const hashedPassword = await bcrypt.hash(password,10)
       const newUser =   new Employer({
        username, email, password:hashedPassword,phoneNumber,companyName,numberOfEmployees,aboutYourCompany         })
        await newUser.save()
        // const accessToken = jwt.sign({
        //   id:newUser._id, email:newUser.email
        // }, process.env.KEY)
        // const token = new Token({
        //   userId:newUser._id,
        //   token:accessToken,
        // })
        // await token.save()

        // const url = `${process.env.BASE_URL}/users/${newUser._id}/verify/${token.token}`
        // await sendEmail(newUser.email, "Verify email", url)

        return res.json({status:true,message:"Please verify an email that is sent to your account."})
    } catch (error) {
        return res.json(error)
    }
    
})
// router.get("/:id/verify/:token", async (req, res)=>{
//   try {
//     const user = await User.findOne({_id:req.params.id})
//     if(!user){
//       return res.json({message:"Invalid link"})
//     }
//     const token = await Token.findOne({
//       userId:user._id,
//       token:req.params.token
//     })
//      if(!token){
//       return res.json({message:"Invalid link"})
//      }
//      await User.updateOne({_id:user._id, verified:true})
//      await token.remove()
//     return res.json({status:true, message:"Email verified successfully"})
//   } catch (error) {
//     console.log(error)
//   }
// })
// User login

router.post("/employerLogin", async(req, res)=>{
    const {email ,password} =req.body;
    const user= await Employer.findOne({email})
     if(!user){
      return res.json({message:`Your  email  is invalid`})
     }

     const isPasswordValid = await bcrypt.compare(password, user.password)
      if(!isPasswordValid){
         return res.json({message:"Password is incorrect. Please try again."})
      }
      // if(!user.verified){
      //   let token = await Token.findOne({userId:user._id})
      //    if(!token){
      //     const accessToken = jwt.sign({
      //       id:user._id, email:user.email, isAdmin:user.isAdmin,
      //     }, process.env.KEY, {expiresIn:"5m"})
          
      //     token = await new Token({
      //       userId:user._id, token:accessToken
      //     }).save()
      //     const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`
      //     await sendEmail(user.email, "Verify email", url)
        // }
//  return res.json({message:"Please verify an email that is sent to your account."})
      // }
      const accessToken = jwt.sign({
        id:user._id, email:user.email,
        username:user.username

      }, process.env.KEY)
      res.cookie("employerToken", accessToken, {httpOnly:true})
      return res.json({status:true,message:"User successfully logged in"})
    })



      async function verifyUser(req, res) {
        try {
          const token = req.cookies.employerToken;
          if (!token) {
            return res.json({ status: false, message: "no token valid" })
          }
          const decoded = jwt.verify(token, process.env.KEY)
          const username = decoded.username
          return res.json({ status: true, username: username })
        } catch (error) {
          return res.json(error)
        }
      }
      
      router.get("/verify-employer",verifyUser, async (req, res)=>{
        return res.json({message:"Authorised"})
      })
router.get("/logoutEmployer", async (req, res)=>{
  res.clearCookie("employerToken")
  res.json({status:true})
})

router.post("/personalDetails/:id", verifyTokenAndAuthorization, async (req, res)=>{
  const {country, DOB,ethnicity,highestLevelOfEducation,highestCareerLevel,industry}=req.body
})
router.post("/work-experience", verifyTokenAndAuthorization, async(req, res)=>{
  const {jobTitle, companyName, country,city,province,from,to}=req.body;
  
})
router.post("/skill", verifyTokenAndAuthorization, async (req, res)=>{
  const {skillName,yearsOfExperience}=req.body;

})

// router.post("/forgot-password", async (req, res)=>{
//   try {
//     const {email} =req.body;
//     const user = await User.findOne({email})
//     if(user.email==""){
//       return res.json({message:"Please enter a value"})
//     }
//     if(!user){
//       return res.json({message:"User doesn't exist"})
//     }
//     const token = jwt.sign({
//       id:user._id,
//       email:user.email
//     }, process.env.KEY, {expiresIn:"5m"})
//    await sendEmail(user.email, "Forgot Password", token)

//     })
//   } catch (error) {
//     console.log(error)
//   }
// })

// router.post("/reset-password/:token", async (req, res)=>{
//   try {
//     const {password}= req.body;
//     const token = req.params;
//     if(password==""){
//       res.json({message:"Password is required"})
//     }
//     if(!token){
//       res.json({message:"Token is invalid"})
//     }
//     const decoded = jwt.verify(token, process.env.KEY)
//     const id = decoded.id;
//     const hashedPassword = await bcrypt.hash(password,10)
//     await User.findByIdAndUpdate({_id:id}, {password:hashedPassword})
//   } catch (error) {
//     console.log(error)
//   }
// })






      




  router.put("/updateEmployer/:id", verifyAdmin, async (req, res)=>{
    const {username, email, password,phoneNumber,companyName,numberOfEmployees,aboutYourCompany }=req.body;
    await Employer.findByIdAndUpdate({_id:req.params.id},{username, email, password,phoneNumber,companyName,numberOfEmployees,aboutYourCompany })
    return res.json({status:true, message:"user updated successfully"})
  })
  router.delete("/deleteEmployer/:id", verifyAdmin, async (req, res)=>{
    const id = req.params.id;
   await Employer.findByIdAndDelete({_id:id})
   return res.json({status:true,message:"User has been deleted"})
  })
  router.get("/employers", async (req, res)=>{
       const employers = await Employer.find()
       return res.json(employers)
        
   
})
  
  
module.exports =router