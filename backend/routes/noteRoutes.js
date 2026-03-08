const router=require("express").Router()
const Note=require("../models/Note")
const auth=require("../middleware/auth")

router.post("/create",auth,async(req,res)=>{

const note=new Note({
title:req.body.title,
content:req.body.content,
user:req.user.id
})

await note.save()
res.json(note)

})

router.get("/",auth,async(req,res)=>{
const notes=await Note.find({user:req.user.id})
res.json(notes)
})

router.put("/:id",auth,async(req,res)=>{
await Note.findByIdAndUpdate(req.params.id,req.body)
res.json("Updated")
})

router.delete("/:id",auth,async(req,res)=>{
await Note.findByIdAndDelete(req.params.id)
res.json("Deleted")
})

router.get("/share/:id",async(req,res)=>{
const note=await Note.findById(req.params.id)
res.json(note)
})

router.post("/summary",(req,res)=>{
const text=req.body.text
res.json({summary:text.substring(0,120)})
})

module.exports=router