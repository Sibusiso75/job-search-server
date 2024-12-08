const express = require("express")
const router = express.Router()
// const {verifyToken,verifyTokenAndAuthorization,verifyAdmin} = require("./verifyToken")

// router.post("/addReport",verifyTokenAndAuthorization, async (req, res)=>{
//   try {
//     const {report}= req.body;
//      const newReport = new Report({
//       report
//      })
//      await newReport.save()
//     return res.json({status:true,message:"Thank you for your report. We'll look into it"})
//   } catch (error) {
//     console.log(error)
//   }
// })
// router.delete("/report/:id",verifyTokenAndAuthorization, async (req, res)=>{
//   try {
//     const id = req.params.id;
//     await Report.findByIdAndDelete(id)
//     return res.json({status:true, message:"Report has been deleted"})
//   } catch (error) {
//     console.log(error)
//   }
// })

// router.get("/reports",verifyAdmin, (request, response)=>{
//     response.status(200).json([{id:1,level:"Entry", 
//       username:"Sibusiso Matebese",
//       email:"sibusisomatebese75@gmail.com",
//       posted:"13 June 2024", 
//       title:"Frontend developer", 
//       description:"We are big tech company based in Cape Town. We are looking for talented Frontend developer to join our team. ", 
//       requirements:"Must be proficient in  HTML, CSS, JavaScript, and frameworks such as React, Angular and Vue.",
//        report:"This a scam"},
//     ])
//   })
  router.get("/reports", (request, response)=>{
    response.status(200).json([{id:1,level:"Entry", 
      username:"Sibusiso Matebese",
      email:"sibusisomatebese75@gmail.com",
      posted:"13 June 2024", 
      title:"Frontend developer", 
      description:"We are big tech company based in Cape Town. We are looking for talented Frontend developer to join our team. ", 
      requirements:"Must be proficient in  HTML, CSS, JavaScript, and frameworks such as React, Angular and Vue.",
       report:"This a scam"},
    ])
  })


  module.exports = router