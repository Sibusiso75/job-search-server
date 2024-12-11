const express = require("express")
const router = express.Router()
const User = require("../../models/JobSeeker/User")
const {verifyTokenAndAuthorization,verifyAdmin} = require("../verifyToken")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const Token = require("../../models/JobSeeker/token")
const Skill = require("../../models/JobSeeker/Skill")

router.post("/addSkill/:id", verifyTokenAndAuthorization, async (req, res)=>{
    try {
        
        const {skillName,skillLevel} =req.body
        const newSkill = new Skill({
            skillName, skillLevel,
             username:req.user.username,
             userId:req.user.id
        })
        await newSkill.save()
        return res.json({status:true, message:"Skill added successfully"})
    } catch (error) {
        return res.json(error)
    }
})

router.get("/mySkills/:id", verifyTokenAndAuthorization, async (req, res)=>{
    try {
        
        const skills = await Skill.find({userId:req.params.id})
        return res.json(skills)
    } catch (error) {
        return res.json(error)
    } 
})

router.put("/editSkill/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try {
        const {skillName,skillLevel} =req.body
 
        await Skill.findByIdAndUpdate({_id:req.params.id},
            { skillName,skillLevel})
            return res.json({status:true, message:"Skill has been updated"})
    } catch (error) {
        return res.json(error)
    } })

 router.delete("/deleteSkill/:id", verifyTokenAndAuthorization, async (req, res)=>{
    try {
        await Skill.findByIdAndDelete({_id:req.params.id})
    } catch (error) {
        return res.json(error)
    }
 })

module.exports = router

