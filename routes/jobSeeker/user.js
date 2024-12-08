const express = require("express")
const router = express.Router()
const User = require("../../models/JobSeeker/User")
const {verifyTokenAndAuthorization,verifyAdmin} = require("../verifyToken")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const Token = require("../../models/JobSeeker/token")
const Feedback = require("../../models/JobSeeker/Feedback")



// const highestQualification =["Grade 12", "Grade 11","Grade 10", "Higher Certificate","Diploma","Degree","Masters", "PHD"]
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
router.post("/register", async (req, res)=>{
    try {
      
        const {username, email, password,dateOfBirth, gender,
          postalCode, aboutMe, province, country,town }=req.body;
    const user = await User.findOne({email})
    
          if(user){
              return res.json({message:"User already exists"})
          } 
          const hashedPassword = await bcrypt.hash(password,10)
          
          const newUser =   new User({
                username, email, password:hashedPassword
                ,dateOfBirth, town,
          postalCode, aboutMe, province, country,gender
                
           })

        const accessToken = jwt.sign({
          id:newUser._id, email:newUser.email,
          username:newUser.username,
          isAdmin:newUser.isAdmin
        }, process.env.KEY)
      // const encodedToken = encodeURIComponent(accessToken).replace(/\./g, "%2E")
         

        const token = new Token({
          userId:newUser._id,
          token:accessToken
        })

        await token.save()
        await newUser.save()
  return res.json({status:true, message:"account created successfully"})
}
catch (error) {
   return res.json(error)
}
})
//         var transporter = nodemailer.createTransport({
//           service:"gmail",
//           auth:{
//             user:process.env.EMAIL, pass:process.env.PASS}
//         })
//         const encodedToken = encodeURIComponent(accessToken).replace(/\./g, "%2E")

//         var mailOptions = {
//           from:process.env.MYEMAIL,
//           to:email,
//           subject:"Verify account",
//           html:`<p>Hi ${newUser.username}</p>
//           <p>To reset your password, click the link below.</p>       
//           <a href=${process.env.BASE_URL}/users/${newUser._id}/verify/${encodedToken}>
//           Verify account link</a>
//           `
//         }
//         transporter.sendMail(mailOptions, function(error, info){
//           if(error){
//             console.log(error)
//           }
//           else{
//            return res.json({status:true, message:"Email sent"})
//           }
//         })      
   
router.get("/:id/verify/:token", async (req, res)=>{
  try {
    const user = await User.findOne({_id:req.params.id})
    if(!user){
      return res.json({message:"Invalid link"})
    }
    const token = await Token.findOne({
      userId:user._id,
      token:req.params.token
    })
    // const encodedToken = encodeURIComponent(accessToken).replace(/\./g, "%2E")

     if(!token){
      return res.json({message:"Invalid link"})
     }
     await User.updateOne({_id:user._id, verified:true})
     await token.remove()
    return res.json({status:true, message:"Email verified successfully"})
  } catch (error) {
    return res.json(error)
  }
})
// User login

router.post("/login", async(req, res)=>{
  try {
    const {email ,password} =req.body;
    const user= await User.findOne({email})
    if(email==""){
      return res.json({message:"Email is required"})
    }
    if(password==""){
      return res.json({message:"Password is required"})
    }
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
        
      //     var transporter = nodemailer.createTransport({
      //       service:"gmail",
      //       auth:{
      //         user:process.env.EMAIL, pass:process.env.PASS}
      //     })
      // const encodedToken = encodeURIComponent(accessToken).replace(/\./g, "%2E")

      //     var mailOptions = {
      //       from:process.env.MYEMAIL,
      //       to:email,
      //       subject:"Verify account",
      //       html:`<p>Hi ${user.username}</p>
      //       <p>To reset your password, click the link below.</p>       
      //       <a href=${process.env.BASE_URL}/users/${user._id}/verify/${encodedToken}>
      //       Verify account link</a>
      //       `
      //     }
      //     transporter.sendMail(mailOptions, function(error, info){
      //       if(error){
      //         console.log(error)
      //       }
      //       else{
      //        return res.json({emailSent:true, message:"Email sent"})
      //       }
      //     })        }
      // }
      const token = jwt.sign({
        id:user._id,
        email:user.email,
        username:user.username,
        isAdmin:user.isAdmin

      }, process.env.KEY)
      res.cookie("token", token, {httpOnly:true})
      return res.json({status:true, message:"Successfully logged in"})
  } catch (error) {
    return res.json(error)
  }
   
    })

      


router.post("/addFeedback/:id", verifyTokenAndAuthorization, async (req, res)=>{
  try {
     const {feedbackMessage} = req.body
    
    const addFeedback = new Feedback({
      feedbackMessage,
      userId:req.user.id,
      username:req.user.username,
    })
    await addFeedback.save()
    return res.json({status:true, message:"Feedback has been submitted. Thank you for your feedback."})
  } catch (error) {
    
  }
})

router.put("/addWork/:id", verifyTokenAndAuthorization, async (req, res)=>{
  try {
    const {

      jobTitle,
          companyName,
          yearsOfExperience,
          startDate,
          endDate
    } = req.body
        
    const user = await User.findByIdAndUpdate({_id:req.params.id},{
      jobTitle,
      companyName,
      yearsOfExperience,
      startDate,
      endDate
    })
    await user.save()
    return res.json({status:true, message:"Info has been updated"})
  } catch (error) {
    return res.json(error)
  }
})

router.get("/work-experience/:id", verifyTokenAndAuthorization, async (req, res)=>{
  try {
    const workExperience = await User.findOne({_id:req.params.id})
    return res.json(workExperience)
  } catch (error) {
    return res.json(error)
  }
})
router.put("/addEducation/:id", verifyTokenAndAuthorization, async (req, res)=>{
  try {
    
    const {highestGradePassed,
    schoolName,
    yearObtainedOne,
    institutionName,
    courseName,
    yearObtainedTwo,
   
  }=req.body;
  const user = await User.findByIdAndUpdate({_id:req.params.id},{
    highestGradePassed,
    schoolName,
    yearObtainedOne,
    institutionName,
    courseName,
    yearObtainedTwo,
   
  })
  await user.save()
  return res.json({status:true, message:"Info has been updated"})
  } catch (error) {
 
    return res.json(error)
  }
})
router.get("/education/:id", verifyTokenAndAuthorization, async (req, res)=>{
  try {
  const user =  await User.findOne({_id:req.params.id})
   
  return res.json(user)
  } catch (error) {
    return res.json(error)
  }

})
router.get("/feedbacks", verifyAdmin, async (req, res)=>{
  try {
     const feedbacks = await Feedback.find()
     return res.json(feedbacks)
  } catch (error) {
    return res.json(error)
  }
})

router.post("/skill", verifyTokenAndAuthorization, async (req, res)=>{
  const {skillName,yearsOfExperience}=req.body;

})

router.post("/forgot-password", async (req, res)=>{
  const {email} = req.body;  
  try {
    const user =  await User.findOne({email})
    if(!user){
      return res.json({message:"user is not registered"}) 
    }
    const token = jwt.sign({id:user._id}, process.env.KEY, {expiresIn:"5m"})
    var transporter = nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:process.env.EMAIL, pass:process.env.PASS}
    })
    const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E")
    
    var mailOptions = {
      from:process.env.MYEMAIL,
      to:email,
      subject:"Reset password",
      html:`<p>Hi ${user.username}</p>
      <p>To reset your password, click the link below.</p>       
      <a href="http://localhost:5173/resetPassword/${encodedToken}">
      Reset password link</a>
      `
    }
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error)
      }
      else{
       return res.json({status:true, message:"Email sent"})
      }
    })
  } catch (error) {
    console.log(error)
  }
})

router.post("/reset-password/:token", async (req, res)=>{
  try {
    const {password}= req.body;
    const {token} = req.params;
    
    if(!token){
      res.json({message:"Token is invalid"})
    }
    const decoded = jwt.verify(token, process.env.KEY)
    const id = decoded.id;
    const hashedPassword = await bcrypt.hash(password,10)
    await User.findByIdAndUpdate({_id:id}, {password:hashedPassword})
  } catch (error) {
    console.log(error)
  }
})

  router.put("/updateUser/:id", verifyAdmin, async (req, res)=>{
    try {
      const {username, email, password,dateOfBirth, gender,
        postalCode, aboutMe, province, country}=req.body;
      
      await User.findByIdAndUpdate({_id:req.params.id},{username, email, password,dateOfBirth, gender,
        postalCode, aboutMe, province, country,town})
      return res.json({status:true, message:"user updated successfully"})
    } catch (error) {
      console.log(error)
    }
  })

  router.delete("/deleteUser/:id", verifyAdmin, async (req, res)=>{
    const id = req.params.id;
   await User.findByIdAndDelete({_id:id})
   return res.json({status:true,message:"User has been deleted"})
  })
  router.post("/adminLogin", async (req, res)=>{
    try {
      const {email,password}= req.body;
    const user = await User.findOne({email})
    
       if(password===process.env.ADMIN_PASS){

         const token = jwt.sign({
           id:user._id,
           email:user.email,
           username:user.username,
           isAdmin:user.isAdmin
 
 
         }, process.env.KEY)
         res.cookie("token", token, {httpOnly:true})
         return res.json({status:true, message:"Successfully logged in"})
       }
      else{

        return res.json({message:"You're not an administrator"})
      }
    
    } catch (error) {
      return res.json(error)
    }
    
  })
 router.put("/updateEducation/:id", verifyTokenAndAuthorization, async (req, res)=>{
  try {
    
    const {highestGradePassed,schoolName,yearObtainedOne,institutionName,courseName,yearObtainedTwo} =req.body;
    await User.findByIdAndUpdate({_id:req.params.id},{highestGradePassed,schoolName,yearObtainedOne,institutionName,courseName,yearObtainedTwo})
    return res.json({status:true, message:"Info has been updated"})
  } catch (error) {
    return res.json(error)
  }
 })
router.get("/verify",verifyTokenAndAuthorization, async (req, res)=>{
  try {
    
    return res.json({status:true, id:req.user.id, username:req.user.username, email:req.user.email, isAdmin:req.user.isAdmin})
  } catch (error) {
    return res.josn(error)
  }
})
router.get("/profile/:id", verifyTokenAndAuthorization, async (req, res)=>{
  try {
    const user = await User.findOne({_id:req.params.id})
   return res.json(user)
  } catch (error) {
    return res.json(error)
  }
})
router.get("/logout", async (req, res)=>{
  try {
    res.clearCookie("token")
    res.json({status:true})
  } catch (error) {
    return res.json(error)
  }
})
router.get("/admin",verifyAdmin,  async (req, res)=>{
  try {
     const users = await User.find()
     return res.json(users)
      
  } catch (error) {
      return res.json(error)
      
  }
})

module.exports =router