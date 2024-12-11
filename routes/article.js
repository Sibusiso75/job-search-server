const express = require("express")
const router = express.Router()
// const Article = require("../models/Article")
const {verifyToken,verifyTokenAndAuthorization,verifyAdmin} = require("./verifyToken")


// CREATE - POST request
router.post("/addArticle",verifyTokenAndAuthorization, async (req, res)=>{
    try {
const userExists = await User.findOne({id:req.user._id})
if(userExists){
const {title,level, description,province,url,area}=req.body;
        const newArticles = new Article({
          userId:userExists._id,name:userExists._name, title, level, description,province, url, area
        })
        await newArticles.save()
        return res.json({status:true, message:"Article has been added successfully"})
}
      
    } catch (error) {
        console.log(error)
    }
})


//READ - GET request
// router.get("/articles",verifyTokenAndAuthorization, async (req, res)=>{
//     try {
    
//          const articles = await Article.find()
//          return res.json(articles)
//     } catch (error) {
//        return console.log(error)
//     }
// })



//UPDATE - PUT REQUEST
router.put("/edit/:id",verifyTokenAndAuthorization, async(req, res)=>{
    try {
        const {title,level, description,province,url,area}=req.body;
        const {id}= req.params.id;
        await Article.findByIdAndUpdate({_id:id}, {title,level, description,province,url,area})
        return res.json({status:true, message:"Article post has been updated"})
    } catch (error) {
        return res.json(error)
    }
})

//DELETE - DELETE REQUEST
router.delete("/:id",verifyTokenAndAuthorization, async (req, res)=>{
    const id = req.params.id;
    await Article.findByIdAndDelete(id)
    return res.json({status:true,message:"Article has been removed"})
})


router.get("/articles", (request, response)=>{
  response.status(200).json([{id:1,
    post:"I love React JS",
    userId:"67594497933092b75d42eca6",
    name:"Sibusiso Matebese",
    likes:[{userId:"67594497933092b75d42eca6",username:"Sibusiso Matebese"},{username:"Siyasanga Dobela"},{userId:4,username:"Nwabisa Mbunge"},{userId:2,username:"Sthera"},{userId:5,username:"Bulelwa Cakwebe"},{userId:7,username:"Phumelela Platjies"}],
    comments:[{id:20,date:"11 December 2024",time:"15:00",username:"Siyasanga Dobela",comment:"What's that, Sbu?",replies:[{userId:1,date:"11 December 2024",time:"15:23",username:"Sibusiso Matebese", reply:"It's a JavaScript library that is used to design user interfacs."}, {date:"11 December 2024",time:"15:30",username:"Siyasanga Dobela", reply:"Oh okay"},{date:"11 December 2024",time:"15:40",username:"Sthera Tini", reply:"I'm currently learning React, Sbu. Do you know the difference between State and Props in React?"}, {date:"11 December 2024",time:"15:45",username:"Sibusiso Matebese", reply:"Yes, I do. State is an internal data that can be changed over time, while props are external data that can be passed to a component and cannot be changed"}]}],
    authorEmail:"sibusisomatebese75@gmail.com", 
    date:"11 December 2024",time:"12:00"},
    
{id:2,
  post:"What are controlled components in React?",
  name:"Sthera Tini",
  authorEmail:"stheratini@gmail.com", 
  likes:[{username:"Sibusiso Matebese"},{userId:2,username:"Sthera Tini"}],
  comments:[{id:30,date:"10 December 2024",time:"08:00",username:"Sibusiso Matebese",comment:"Controlled components are components where the form data in controlled by the state of react application", replies:[{date:"10 December 2024",time:"08:30",userId:1,username:"Sthera Tini", reply:"Thanks, my friend."},{date:"10 December 2024",time:"08:35",username:"Sibusiso Matebese", reply:"Sure"}]}],
  date:"10 December 2024",time:"22:00", title:"How to be a better Software Developer",
},
{id:3,
  userId:4,
  post:"Everyone should learn how to program.",
  name:"Sibusiso Matebese",
  authorEmail:"sibusisomatebese75@gmail.com", 
  
  likes:[{userId:1,username:"Sibusiso Matebese"},{userId:6,username:"Siyasanga Dobela"}],
  comments:[{id:40,date:"10 December 2024",time:"17:30",username:"Nwabisa Mbunge",comment:"That's true.", replies:[{date:"10 December 2024",time:"17:31",userId:4,username:"Sibusiso Matebese", reply:"Yeah"}]}],

  date:"10 December 2024",time:"17:28",
},
{id:13,
  post:`"Programming is one of the things in the world that you can do where you just sit down and make something completely new from scratch"`,
  userId:1,

  name:"Sibusiso Matebese",
  authorEmail:"sibusisomatebese75@gmail.com", 
  
  likes:[{userId:1,username:"Sibusiso Matebese"},{username:"Sthera Tini"},{userId:4,username:"Nwabisa Mbunge"},{userId:2,username:"Sthera Tini"},{userId:5,username:"Bulelwa Cakwebe"},{userId:8,username:"Lukhanyo Hendricks"},{userId:7,username:"Phumelela Platjies"}, {userId:3,username:"Cindy Baba"}
],
  comments:[{id:10,date:"11 December 2024",time:"10:10",username:"Nwabisa Mbunge",comment:"Nice post", replies:[{userId:1,date:"11 December 2024",time:"10:11",username:"Sibusiso Matebese", reply:"Thanks"}]}],

  date:"11 December 2024",time:"10:00",
},
])
})
  module.exports =router
  