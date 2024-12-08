const express = require("express");
const Job = require("../models/JobSeeker/Job/Job");
const User = require("../models/JobSeeker/User")
const router = express.Router()
const SavedJob = require("../models/JobSeeker/Job/SavedJob")
const Report = require("../models/JobSeeker/Job/Report")

const jwt = require("jsonwebtoken")


const {verifyToken,verifyTokenAndAuthorization,verifyAdmin} = require("./verifyToken")


router.post("/addJob",verifyAdmin, async (req, res)=>{
    try {
  const {title,numberOfPeopleToHire,description,jobLocation,reside,jobUrl,province,area,jobType} = req.body;
  
              const newJobs = new Job({
                title,numberOfPeopleToHire,description,jobLocation,reside,jobUrl,province,area,jobType,
                userId:req.user.id,
                username:req.user.username,
            })

        await newJobs.save()
        return res.json({status:true, message:"Job has been added successfully"})
    } catch (error) {
        console.log(error)
    }
})

router.get("/allJobs", async (req, res)=>{
    try {
  
      const jobs = await Job.find()
        
         return res.json(jobs)
    } catch (error) {
       return console.log(error)
    }
})

 router.put("/editJob/:id",verifyAdmin, async(req, res)=>{
     try {
         const {title,numberOfPeopleToHire,description,jobLocation,reside,jobUrl,province,area,jobType}=req.body;
          
     
       await Job.findByIdAndUpdate({_id:req.params.id}, {username:req.user.username,userId:req.user.id,title,numberOfPeopleToHire,description,jobLocation,reside,jobUrl,province,area,jobType})
        return res.json({status:true, message:"Job post has been updated"})
     } catch (error) {
         return res.json(error)
    }
})

router.delete("/deleteJob",verifyAdmin, async (req, res)=>{
  try {
    
    const id = req.params.id;
    await Job.findByIdAndDelete({_id:id})
    return res.json({status:true,message:"Job has been removed"})
  } catch (error) {
    console.log(error)
  }
})

router.post("/saveJob/:id",verifyTokenAndAuthorization, async (req,res)=>{ 
  try {
    const job = await Job.findOne({_id:req.params.id})
  const savedJobs = new SavedJob({
     userId:req.user.id,
  jobId:job._id,
  description:job.description,
  title:job.title,
  numberOfPeopleToHire:job.numberOfPeopleToHire,
  jobUrl:job.jobUrl,
  jobLocation:job.jobLocation,
  reside:job.reside,
  province:job.province,
  jobType:job.jobType,
  area:job.area,
  username:req.user.username,

  })
  await savedJobs.save()
  return res.json({status:true, message:"Job has been saved"})
  }
  catch(err){
  console.log(err)
  }
  })
  

  router.post("/addReport/:id",verifyTokenAndAuthorization, async (req,res)=>{ 
    try {
      const {reportMessage,status}=req.body;
      const job = await Job.findOne({_id:req.params.id})
    const newReport = new Report({
       userId:req.user.id,
       reportMessage,
       status,
    jobId:job._id,
    description:job.description,
    title:job.title,
    numberOfPeopleToHire:job.numberOfPeopleToHire,
    jobUrl:job.jobUrl,
    jobLocation:job.jobLocation,
    reside:job.reside,
    province:job.province,
    jobType:job.jobType,
    area:job.area,
    username:req.user.username,
  
    })
    await newReport.save()
    return res.json({status:true, message:"Job has been reported"})
    }
    catch(err){
    console.log(err)
    }
    })
    


router.get("/mysavedJobs/:id", verifyTokenAndAuthorization, async (req, res)=>{
  try {
    
    const savedJobs= await SavedJob.find({userId:req.params.id})
    return res.json(savedJobs)
  
  } catch (error) {
    return res.json(error)
  }
})

router.get("/myreports/:id", verifyTokenAndAuthorization, async (req, res)=>{
  try {
    
    const myReports= await Report.find({userId:req.params.id})
    return res.json(myReports)
  
  } catch (error) {
    return res.json(error)
  }
})
router.get("/allReports", verifyAdmin, async (req, res)=>{
  try {
    
    const allJobs= await Report.find()
    return res.json(allJobs)
  
  } catch (error) {
    return res.json(error)
  }
})

router.delete("/deleteReport/:id", verifyAdmin, async (req, res)=>{
  try {
    
    await Report.findByIdAndDelete({_id:req.params.id})
    return res.json({status:true, message:"Report has been removed"})

  } catch (error) {
    return res.json(error)
  }
})
router.put("/editReport/:id",verifyAdmin, async (req, res)=>{
  try {
    const {status} = req.body;
     await Report.findByIdAndUpdate({_id:req.params.id},{
    
      status
  
    })
    return res.json({status:true, message:"Report has been updated"})
  } catch (error) {
    
  }
})
// router.delete("/deleteSavedJob",verifyTokenAndAuthorization, async (req,res)=>{
//     try {
//         const id = req.params.id;
//         await Save.findByIdAndDelete(id)
//         return res.json({status:true,message:"Job has been unsaved"})
//     } catch (error) {
//         console.log(error)
//     }
// })
const PAGE_SIZE =3;
router.get("/jobs/search", verifyTokenAndAuthorization, async (req,res)=>{
  const {query}= req;
const pageSize = query.pageSize || PAGE_SIZE
const page = query.page || 1;
const category = query.category || ""
const salary = query.salary || ""
const order = query.order || ""
const searchQuery = query.query || ""

const queryFilter = searchQuery && searchQuery!=="all"?
{
title:{$regex:searchQuery, $options:'i'}
}:{}
const categoryFilter = category && category!=="all"?
{category}:{}
const salaryFilter = salary && salary!=="all"?
{
  salary:{
    $gte:Number(salary.slit("-")[0]),
    $lte:Number(salary.slit("-")[1])
  }
  
}:{}
const sortOrder = order=="featured"?{featured:-1}
:order=="lowest"?{salary:1}:
order=="highest"?{salary:-1}:
order=="newest"?{createdAt:-1}:{_id:-1}

const jobs = await Job.find({
  ...queryFilter,
  ...categoryFilter, 
  ...salaryFilter
}).sort(sortOrder).skip(pageSize*(page-1)).limit(pageSize)

const countJobs = await Job.countDocuments({
  ...queryFilter,
  ...categoryFilter, 
  ...salaryFilter
})
res.send({jobs,
  countJobs,
  page,
  pages:Math.ceil(countJobs/pageSize)
})
})
router.get('/jobs/categories',async (req, res) => {
    const categories = await Job.find().distinct('category');
    res.send(categories);
  })



  // router.post("/save-job",verifyTokenAndAuthorization, async (req, res)=>{
  //    const {description, category, url,salary,  user} = req.body;
  //    const newJobs = new SavedJob({
  //     saveJobs: req.body.saveJobs.map((x) => ({ ...x, job: x._id })),
  //     description, 
  //     category, 
  //     url,salary, 
  //     user: req.user._id,

  //    })
  //    await newJobs.save()
  //    return res.json({status:true,message:"Job has been saved"})
  // })
//   router.get("/jobs", (request, response)=>{
//     const jobTypes =["Full time", "Part time", "Contract", "Temporary", "Internship", "Learnership"]
//     response.status(200).json([{id:1, title:"Stock Assistant- Afrika Tikkun Services", description:"Work Experience, as a Stock Assistant, in Port Elizabeth .Responsibilities Data Capturing To handle, record and complete daily physical stock transfers Picking and Packing of orders .Perform periodic or random stock counts. Good Warehouse Keeping Ad Hoc. Requirements: Attention to detail. Knowledge of Excel (Basic - Intermediate). Mathematical Literacy Report writing skills. Must be able to perform under pressure. 1 - 2 Years experience with Telcommunications",
//   level:"Entry",numberOfPeopleToHire:1,
//   EmployeesResideInJoblocation:"Yes",
//   jobType:"Not specified",
//   locationThatBestDescriptionsTheJob:"In-person. Precise location",
//     posted:"17 August 2024", url:"https://www.indeed.com",province:"Eastern Cape",area:"Port Elizabeth"}
//   , 

//   {id:2, title:"General Assistant - B4A Port Elizabeth", description:"Qualifications: Grade 12. Good communication skills. Product knowledge. Customer service orientated. Must be physically able to pick up heavy weights",
//   level:"Not specified",numberOfPeopleToHire:1,
//   EmployeesResideInJoblocation:"Yes",
//   jobType:jobTypes[0],
//   posted:"20 August 2024",

//   locationThatBestDescriptionsTheJob:"In-person. Precise location",
//   numberOfPeopleToHire:1,
// url:"https://thebuildingcompany.mcidirecthire.com/External/Application?Ref=m4fgzrmOdjsdJFpGPPCcsSrNvU9yv0lm1r2lW%2bicOU%2bdb27CpXwePnb792zgVrOOYYzF8NiaP95bxQNsQbONgj8oecF5hng4Idk%2fyOCBPXc%3d",province:"Eastern Cape",area:"Port Elizabeth"}, 
//   {id:3, title:"Admin Assistant", description:"Salary: R8 000 - R9 000 per month commensurate with qualification and experience. Qualifications / Requirements: · Matric Certificate · Excel experience essential · Organisational skills · Attention to detail · Good communication skills · Sage Evolution experience beneficial", 
//   posted:"20 August 2024",
//   level:"Not specified",
//   jobType:jobTypes[0],
//   EmployeesResideInJoblocation:"No",
//   locationThatBestDescriptionsTheJob:"In-person. Precise location",
//   url:"https://www.indeed.com",province:"Eastern Cape",area:"Port Elizabeth"},

//   {id:4, title:"Junior Frontend developer", description:" Our company is looking for talented Frontend developer to join our team. Requirements: Must be proficient in HTML5, CSS, JavaScript and TypeScript. Optimization of the application for maximum speed and scalability. Implementing automated testing platforms and unit tests.", 
//   level:"Entry",  numberOfPeopleToHire:1,
//   EmployeesResideInJoblocation:"No",
//   jobType:jobTypes[0],

//   locationThatBestDescriptionsTheJob:"Hybrid. The job combines working in office and remotely",
//   posted:"20 August 2024",province:"Western Cape",area:"Somerset West"}, 
//   {id:5, title:"Junior web developer", description:"Requirements: 1-3 years of experience in software development. Develop and maintain unit tests and integration tests. Do code reviews and participate in pair programming. Implement and use git as a versioning tool",
//   level:"Junior/Mid-level",EmployeesResideInJoblocation:"No", 
//   numberOfPeopleToHire:1,  jobType:jobTypes[0],
//   locationThatBestDescriptionsTheJob:"Hybrid. The job combines working in office and remotely",
//   posted:"20 August 2024",url:"https://www.indeed.com",province:"Gauteng",area:"Pretoria"},

//   {id:6, title:"Shop Assistant", description:"Requirements: A matric, grade 12 or equivalent certificate. Ensure that point of sale and banking procedures are adhered and raise any areas of concern wit the area manager", 
//   level:"Entry",  numberOfPeopleToHire:1,
//   EmployeesResideInJoblocation:"No",
//   jobType:jobTypes[0],
//   locationThatBestDescriptionsTheJob:"In-person. Precise location",
//   posted:"20 August 2024",province:"Eastern Cape",area:"Port Elizabeth"}, 

//   {id:7, title:"Junior web developer ", description:"Requirements: Strong foundation and understanding of HTMLand CSS without using Bootstrap or page builders. The developer must be able to accurately follow designs and create the intended functionality", 
//   level:"Entry",  numberOfPeopleToHire:1,
//   EmployeesResideInJoblocation:"No",
//   jobType:jobTypes[0],

//   locationThatBestDescriptionsTheJob:"In-person. Precise location",
//   posted:"19 August 2024",province:"Western Cape",area:"Cape Town"}, 

//   {id:8, title:"Clerk: Receiving (Seanonal Permanent)", description:"The receiving clerk's responsibility include verifying the delivered Fibre and ensuring all data is correctly documented on the clip advise and delivery note. Ensure general housekeeping are done daily", 
//   level:"Not specified",  numberOfPeopleToHire:1,
//   EmployeesResideInJoblocation:"No",
//   jobType:jobTypes[0],

//   locationThatBestDescriptionsTheJob:"In-person. Precise location",
//   posted:"18 August 2024",province:"Eastern Cape",area:"Port Elizabeth"}, 
//   ])
//   })
//   router.get("/savedJobs", (request, response)=>{
//     const jobTypes =["Full time", "Part time", "Contract", "Temporary", "Internship", "Learnership"]
//   response.status(200).json([{id:1, title:"Stock Assistant- Afrika Tikkun Services", description:"Work Experience, as a Stock Assistant, in Port Elizabeth .Responsibilities Data Capturing To handle, record and complete daily physical stock transfers Picking and Packing of orders .Perform periodic or random stock counts. Good Warehouse Keeping Ad Hoc. Requirements: Attention to detail. Knowledge of Excel (Basic - Intermediate). Mathematical Literacy Report writing skills. Must be able to perform under pressure. 1 - 2 Years experience with Telcommunications",
//   level:"Entry",numberOfPeopleToHire:1,
//   EmployeesResideInJoblocation:"Yes",
//   jobType:"Not specified",
//   locationThatBestDescriptionsTheJob:"In-person. Precise location",
//     posted:"17 August 2024", url:"https://www.indeed.com",province:"Eastern Cape",area:"Port Elizabeth"}
//   , 
  
//   {id:2, title:"General Assistant - B4A Port Elizabeth", description:"Qualifications: Grade 12. Good communication skills. Product knowledge. Customer service orientated. Must be physically able to pick up heavy weights",
//   level:"Entry",numberOfPeopleToHire:1,
//   EmployeesResideInJoblocation:"Yes",
//   jobType:jobTypes[0],
//   posted:"20 August 2024",

//   locationThatBestDescriptionsTheJob:"In-person. Precise location",
//   numberOfPeopleToHire:1,
// url:"https://thebuildingcompany.mcidirecthire.com/External/Application?Ref=m4fgzrmOdjsdJFpGPPCcsSrNvU9yv0lm1r2lW%2bicOU%2bdb27CpXwePnb792zgVrOOYYzF8NiaP95bxQNsQbONgj8oecF5hng4Idk%2fyOCBPXc%3d",province:"Eastern Cape",area:"Port Elizabeth"}, 
   
// {id:4, title:"Jnuior Frontend developer", description:" Our company is looking for talented Frontend developer to join our team. Requirements: Must be proficient in HTML5, CSS, JavaScript and TypeScript. Optimization of the application for maximum speed and scalability. Implementing automated testing platforms and unit tests.", 
//   level:"Entry",  numberOfPeopleToHire:1,
//   EmployeesResideInJoblocation:"No",
//   jobType:jobTypes[0],

//   locationThatBestDescriptionsTheJob:"Hybrid. The job combines working in office and remotely",
//   posted:"20 August 2024",province:"Western Cape",area:"Somerset West"}, 
// {id:5, title:"Junior web developer", description:"Requirements: 1-3 years of experience in software development. Develop and maintain unit tests and integration tests. Do code reviews and participate in pair programming. Implement and use git as a versioning tool",
// level:"Mid-level",EmployeesResideInJoblocation:"No", 
// numberOfPeopleToHire:1,  jobType:jobTypes[0],
// locationThatBestDescriptionsTheJob:"Hybrid. The job combines working in office and remotely",
// posted:"20 August 2024",url:"https://www.indeed.com",province:"Gauteng",area:"Pretoria"},


//   ])
//   })


  module.exports =router