const express = require("express")
const app = express()
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cookieParser=require("cookie-parser")
const cors = require("cors")
const userRoute = require("./routes/jobSeeker/user")
const jobRoute = require("./routes/job")
const articleRoute = require("./routes/article")
const reportRoute = require("./routes/report")
const employerRoute = require("./routes/employer/employer")
const skillRoute = require("./routes/jobSeeker/skills")
// const postRoute = require("./routes/post/post")
// const commentRoute = require("./routes/post/comment")


dotenv.config()
app.use(cookieParser())
app.use(express.json())
// https://jobsearchapp-aaoq.onrender.com
app.use(cors({
  origin:["https://jobsearchapp-aaoq.onrender.com/"],
  credentials:true
}))

mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("MongoDB connected")
}).catch((error)=>{
  console.log(error)
})

app.get("/", (request, response)=>{
  response.status(200).send("Hello world from the server")
})
app.use("/", employerRoute)
app.use("/", userRoute)
app.use("/", jobRoute)
app.use("/", articleRoute)
app.use("/", employerRoute)
app.use("/", reportRoute)
app.use("/", skillRoute)

// app.use("/", postRoute)
// app.use("/", commentRoute)


app.all("*", (request, response)=>{
  response.status(404).send("404 - Page not found")


})
app.listen(5000, ()=>{
  console.log("Listening to port 5000")
})