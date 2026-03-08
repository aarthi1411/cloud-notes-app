const jwt = require("jsonwebtoken")

module.exports = (req,res,next)=>{

const token=req.header("token")

if(!token) return res.status(401).send("Access denied")

try{

const verified=jwt.verify(token,"secret123")
req.user=verified
next()

}catch{
res.status(400).send("Invalid token")
}

}