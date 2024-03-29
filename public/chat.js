const chatbox= document.querySelector('.container')
const chatform= document.querySelector("#chatform")
const message= document.querySelector('#message')
const sendbtn= document.querySelector('#sendbtn')
const grouplist= document.querySelector('#grplist')
sendbtn.addEventListener('click', sendMessage)


window.addEventListener('DOMContentLoaded',refresh)

function refresh()
{
    checkgroup()

}
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }
  

async function sendMessage()
{
    const msgdata={
        msg:message.value,
        groupId:localStorage.getItem('groupId')
    }
    const token= localStorage.getItem('token')
    try{
        const res= await axios.post('/addmessage',msgdata, {headers: { "Authorization": token }})
         console.log(res.data);
        message.value=""
       messagedata()
     // messagedisplay(res.data.msg,token)
    }
    catch(e)
    {
        alert('mesage could not send try again letter')
        console.log(e)
    }   
} 
//setInterval(messagedata, 1000)

async function messagedata()
{
   grpId= localStorage.getItem('groupId')
    token= localStorage.getItem('token')
    if(token)
    {
        try{
            const response= await axios.get(`/allmessage/${grpId}`)
           // console.log(response.data.msg)
            messagedisplay(response.data.msg,token)

        }
        catch(e)
        {
            console.log(e)
        }
    }
    else{
        alert('you must be logged in first')
    }
}

 function messagedisplay(response,token)
{
    chatbox.innerHTML=``;
    const parsetoken= parseJwt(token)

     response.forEach(res => {

        if(res.userId==parsetoken.id)
        {
            const para= document.createElement('p')
            para.innerHTML=`you : ${res.msg}`
            chatbox.appendChild(para)
            para.style.color="red"
        }
        else{
            const para= document.createElement('p')
            para.innerHTML=`${res.name} : ${res.msg}`
            chatbox.appendChild(para)
            para.style.color="purple"

        }
        
     })
}
function creategrp()
{
    document.getElementById('grpform').style.display='block'
    
}

async function grpcreated(){

    const token=localStorage.getItem('token')
    if(token)
    {
            const grpname= document.getElementById('grpname').value
            try{
                const response= await axios.post('/creategrp',{grpname},{headers: { "Authorization": token }})
              //  console.log(response)
            }
            catch(e)
            {
                console.log(e)
                alert(e)
            }
    }
    else{
        alert('create account')
    }

}
async function checkgroup()
{
    const token=localStorage.getItem('token')
    const parsetoken=parseJwt(token)
    try{
        const grpinfo= await axios.get(`/getallgroup/${parsetoken.id}`)
      //  console.log(grpinfo)
        grpdispaly(grpinfo.data.group)
    }
    catch(e)
    {
        console.log(e)
    }
     
}

function grpdispaly(groups)
{
    groups.forEach(res =>{
       console.log(res)
        const para= document.createElement('p')
        para.innerHTML=`${res.grpname}`;
        const chatbtn= document.createElement('button')
        chatbtn.textContent='see chat'
        const adduser= document.createElement('button')
        adduser.textContent='Add User'
        para.appendChild(adduser)
        para.appendChild(chatbtn)

        grouplist.appendChild(para)
        adduser.addEventListener('click',()=>{
            const email=prompt('enter email id')
            console.log(email)
            addMember(email,res)
        })

        chatbtn.addEventListener('click',()=>{
            document.querySelector('.footer').style.display='block'
            localStorage.setItem('groupId',res.groupId)
           
         // messagedata()
        })

    })

}
setInterval(messagedata, 1000)

async function addMember(email,grp)
{
    const info={
        email:email,
        grpname:grp.grpname,
        grpid:grp.groupId
    }
    try{
        const group= await axios.post('/addmember',info)
        console.log(group)
    }
    catch(e)
    {
        alert(e)
        console.log(e)
    }
}






