let token=""
let username=""

const API="http://localhost:5000/api"

async function register(){

await fetch(API+"/users/register",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({

name:rname.value,
email:remail.value,
password:rpass.value

})

})

alert("Registered")

}

async function login(){

const res=await fetch(API+"/users/login",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({

email:lemail.value,
password:lpass.value

})

})

const data=await res.json()

token=data.token
username=data.name

loadNotes()

}

async function createNote(){

await fetch(API+"/notes/create",{

method:"POST",

headers:{
"Content-Type":"application/json",
token
},

body:JSON.stringify({

title:title.value,
content:content.value,
username:username,
reminder:reminder.value

})

})

loadNotes()

}

async function loadNotes(){

const res=await fetch(API+"/notes",{
headers:{token}
})

const data=await res.json()

let pinned=[]
let normal=[]

data.forEach(n=>{

if(n.pinned) pinned.push(n)
else normal.push(n)

})

const all=[...pinned,...normal]

let html=""

all.forEach(n=>{

html+=`

<div class="note ${n.pinned?'pin':''}">

<h3>${n.title}</h3>

<small>by ${n.username}</small>

<p>${n.content}</p>

<button onclick="pin('${n._id}')">📌 Pin</button>

<button onclick="del('${n._id}')">Delete</button>

<button onclick="share('${n._id}')">Share</button>

</div>

`

})

notes.innerHTML=html

checkReminder(data)

}

async function del(id){

await fetch(API+"/notes/"+id,{
method:"DELETE",
headers:{token}
})

loadNotes()

}

async function pin(id){

await fetch(API+"/notes/"+id,{

method:"PUT",

headers:{
"Content-Type":"application/json",
token
},

body:JSON.stringify({pinned:true})

})

loadNotes()

}

function search(q){

const all=document.querySelectorAll(".note")

all.forEach(n=>{

n.style.display=n.innerText.toLowerCase().includes(q.toLowerCase())
?"block":"none"

})

}

function toggleDark(){

document.body.classList.toggle("dark")

}

function voice(){

const rec=new webkitSpeechRecognition()

rec.onresult=e=>{
content.value=e.results[0][0].transcript
}

rec.start()

}

function share(id){

const link=API+"/notes/share/"+id

navigator.clipboard.writeText(link)

alert("Share link copied")

}

function checkReminder(notes){

const now=new Date().getTime()

notes.forEach(n=>{

if(n.reminder){

const time=new Date(n.reminder).getTime()

if(time<now+60000 && time>now){

alert("Reminder: "+n.title)

}

}

})

}