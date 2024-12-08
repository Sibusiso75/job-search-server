const express = require("express")
const router = express.Router()
const {verifyToken,verifyTokenAndAuthorization,verifyAdmin} = require("./verifyToken")
const Employer = require("../models/Employer/Employer")
const EmployerToken = require("../models/Employer/empToken")
const {verifyToken,verifyTokenAndAuthorization,verifyAdmin} = require("../verifyToken")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

// router.get("/employers",verifyAdmin, (request, response)=>{
//     response.status(200).json([{id:1,username:"Sibusiso Matebese",description:"Tech company that is focusing in Software development and online Marketing",province:"Eastern Cape",area:"Uitenhage",age:27,username:"Sibusiso Matebese", gender:"Male",email:"sibusisomatebese75@gmail.com",companyName:"Get Job", isAdmin:"Yes", password:"*************"}
//   ,
//   {id:2,username:"Siyasanga Dobela",companyName:"ShoeDesign",description:"Shoe design company",province:"Eastern Cape",area:"Uitenhage",age:32,username:"Siyasanga Dobela", gender:"Male",email:"siyasangadobela2@gmail.com", isAdmin:"No", password:"************"},
//   {id:3,username:"Phumelela Platjiees",description:"Franchise business",province:"Eastern Cape",area:"Uitenhage",age:25,username:"Phumelela Platjiees", gender:"Male",email:"phumelelaplatjiees202@gmail.com", isAdmin:"No",companyName:"Kioaski", password:"********"}
//   ])
//   })
  
  //Registration - POST REQUEST
router.post("/employerRegister", async (req, res)=>{
  try {
    const {username, email,phoneNumber, password, companyName, numberOfEmployees, aboutYourCompany }=req.body;
const employer = await Employer.findOne({email})



      if(employer){
          return res.json({message:"Employer already exists"})
      } 

      const hashedPassword = await bcrypt.hash(password,10)
      
      const newEmployer =   new Employer({
        username, email,phoneNumber, password:hashedPassword, companyName, numberOfEmployees, aboutYourCompany
            ,verified:false
       })
    const accessToken = jwt.sign({
      id:newEmployer._id, email:newEmployer.email,
      verified:newEmployer.verified
    }, process.env.KEY)
    const token = new EmployerToken({
      EmployerId:newEmployer._id,
      token:accessToken,
    })
    await token.save()
    await newEmployer.save()
    return res.json({status:true, message:"Account created successfully"})
}
 catch (error) {
    return res.json(error)
}
    
})
router.get("/employers", verifyAdmin, async (req, res)=>{
  try {
     const employers = await Employer.find()
     return res.json(employers)
      
  } catch (error) {
      return res.json(error)
      
  }
})

router.put("/updateEmployer/:id", verifyAdmin, async (req, res)=>{
  try {
    const {username, email,phoneNumber, password, companyName, numberOfEmployees, aboutYourCompany }=req.body;
    
    await Employer.findByIdAndUpdate({_id:req.params.id},{username, email,phoneNumber, password, companyName, numberOfEmployees, aboutYourCompany })
    return res.json({status:true, message:"user updated successfully"})
  } catch (error) {
    console.log(error)
  }
})

// //employer login
// router.post("/login", async(req, res)=>{
//     const {email ,password} =req.body;
//     const employer= await Employer.findOne({email})
//     if(!employer){
//         return res.json({message:"employer doesn't exist"})
//     }
//      const isPasswordValid = await bcrypt.compare(employer.password,password)
//       if(!isPasswordValid){
//          return res.json({message:"Password is incorrect. Please try again."})
//       }
      
//       const token = jwt.sign({
//         id:employer._id,
//         email:employer.email,
//         isAdmin:employer.isAdmin,
//       }, process.env.KEY, {expiresIn:"1d"})
//       return res.json({status:true,message:"employer successfully logged in"})
//       // res.cookie("token", token, {httpOnly:true, maxAge:360000})

// })
// router.post("/forgot-password", async (req, res)=>{
//   try {
    
//     const {email} =req.body;
//     const employer = await Employer.findOne({email})
//     if(employer.email==""){
//       return res.json({message:"Please enter a value"})
//     }
//     if(!employer){
//       return res.json({message:"employer doesn't exist"})
//     }
//     const token = jwt.sign({
//       id:employer._id,
//       email:employer.email
//     }, process.env.KEY, {expiresIn:"5m"})
//     const createTransport = nodemailer.createTransport({
//       auth:{
//         user:process.env.EMAIL,
//         password:process.env.PASSWORD,
//       }

//     })
//     const mailOptions = {
//       from:process.env.PASSWORD,
//       to:password,
//       subject:"Reset password",
//       html:`<p>HI ${employer.name}</p> 
//     <p>Click the link below</p>
//     <a href=${token}>Reset password link</a>
//       `
//     }
//     createTransport.sendMail(mailOptions, (err, result)=>{
//       if(err){
//         return res.json({message:"Failed to send email"})
//       }
//       else {
//         return res.json({status:true,message:"Email sent successfully"})
//       }
//     })
//   } catch (error) {
//     console.log(error)
//   }
// })
// router.post("/reset-password/:token", async (req, res)=>{
//   try {
//     const {password}= req.body;
//     const token = req.params;
//     const verifiedEmployer = jwt.verify(token, process.env.KEY)
//     const id = verifiedemployer.id;
//     const hashedPassword = await bcrypt.hash(password,10)
//     await Employer.findByIdAndUpdate({_id:id}, {password:hashedPassword})
    
//   } catch (error) {
//     console.log(error)
//   }
// })
/*
router.put("/employer/:id",verifyUserAndAuthorization, async (req, res)=>{
  try{
   const {id} = req.params.id;
   const {username, email, gender, age}=req.body;
  await Employer.findByIdAndUpdate({_id:id}, {
    username, email, gender, age
  })
 }catch(error){
console.log(error)
 }
})
router.get("/employerProfile/:id",verifyUserAndAuthorization, async (req, res)=>{
  const id = req.params.id;
  const employer = await Employer.findOne({_id:id})
  return res.json({status:true, employer})
})
router.delete("/employer/:id",verifyUserAndAuthorization, async (req, res)=>{
  try{
   const id = req.params.id;
   await Employer.findByIdAndDelete({_id:id})
  }catch(error){
    console.log(error)
  }
})
*/

      



// async function verifyToken(req, res, next) {
//     try {
//       const token = req.cookies.token
//       if (!token) {
//         return res.json({ status: false, message: "no token valid" })
//       }
//        
  //       const decoded = jwt.verify(token, process.env.KEY)
  //             if (!decoded) {
    //         return res.json({ status: false, message: "no token valid" })
    //       }
//               return res.json({ status: true })
//               next()
//           

//     } catch (error) {
//       return res.json(error)
//     }
//   }
//   router.put("/updated/:id", verifyAdmin, async (req, res)=>{
//     const {name, email, password, isAdmin}=req.body;
//     await User.findByIdAndUpdate({_id:req.params.id},{name, email, password, isAdmin})
//     return res.json({status:true, message:"user updated successfully"})
//   })
//   router.delete("/delete/:id", verifyAdmin, async (req, res)=>{
//    await user.findByIdAndDelete(id)
//    return res.json({message:"User has been deleted"})
//   })
//   router.get("/admin", verifyAdmin, async (req, res)=>{
//     try {
        
//        const users = await User.find()
//        return res.json(users)
        
//     } catch (error) {
//         return res.json({message:"error"})
        
//     }
// })
  module.exports = router