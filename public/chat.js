const chatbox= document.querySelector('.container')
const chatform= document.querySelector("#chatform")
const message= document.querySelector('#message')
const sendbtn= document.querySelector('#sendbtn')
const grouplist= document.querySelector('#grplist')
const groupchat = document.querySelector('#grouptitle')
const groupdetails= document.querySelector('#groupdetails')
sendbtn.addEventListener('click', sendMessage)

const socket = io.connect("http://localhost:3001");


window.addEventListener('DOMContentLoaded',refresh)

function refresh()
{
    getallGroup()

}
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }


  
  socket.on("message", (msgdata) => {
    messagedata() });
  
  socket.on('update',(userId)=>{  
    const token= parseJwt(localStorage.getItem('token'))
    if(userId==token.id)
    {
        getallGroup()
    }  
  }) 

  socket.on("deletegrp", () => {getallGroup() });

  

async function sendMessage(e)
{
    e.preventDefault();
    const token= localStorage.getItem('token')

    try{
        if (document.getElementById('file').files[0]) {

         //   const token = localStorage.getItem('token');
            const groupId = localStorage.getItem('groupId');
            let file = document.getElementById('file').files[0];
            let formData = new FormData();
            formData.append("file", file)
            console.log("------->", formData);
      
           const headers = {
              "Authorization": token,
             'Content-Type': 'multipart/form-data'     
           }
      
            const res = await axios.post(`/upload/${groupId}`, formData, {headers})
            console.log(res.data.userFile);
      
           // socket.emit("file", res.data.userFile.message, res.data.userFile.name, groupId, res.data.userFile.userId)
           messagedata()
           socket.emit("message",res); 
        }
    else{
           const msgdata={
                 msg:message.value,
                 groupId:localStorage.getItem('groupId')
                }
              const res= await axios.post('/addmessage',msgdata, {headers: { "Authorization": token }})
              message.value=""
              messagedata()
              socket.emit("message",msgdata);
        }
    }
    catch(e)
    {
        alert('message could not send try again letter')
        console.log(e)
    }   
} 


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
    groupchat.style.display="block"

    groupdetails.style.display="block"
    
    groupchat.innerHTML=`<h3>${localStorage.getItem('groupname')}</h3>`
   
    chatbox.innerHTML=``;
    const parsetoken= parseJwt(token)

     response.forEach(res => {
       
        if(res.userId==parsetoken.id)
        {
            const para= document.createElement('p')
            if(res.type=='text')
            {
                para.innerHTML=`you : ${res.msg}`
            }
            else{
                para.innerHTML=`you:<a href="${res.msg}"> click to see download</a>`
            }
            
            chatbox.appendChild(para)
            para.style.color="red"
        }
        else{
            const para= document.createElement('p')
            if(res.type=="text")
            para.innerHTML=`${res.name} : ${res.msg}`
           else
           {
            console.log(res.msg)
            para.innerHTML=`${res.name} :<a href="${res.msg}"> click to see download</a>`
           }
          
            chatbox.appendChild(para)
            para.style.color="purple"

        }
        
     })
}
function creategrp()
{
    document.getElementById('grpform').style.display='block'
    
    
}
async function getallMember()
{
   const id= localStorage.getItem('groupId')
    try{

        const memebrs= await axios.get(`/group/members/${id}`)
        console.log(memebrs)

    }
    catch(e)
    {
        console.log(e)
    }
}

async function grpcreated(){

    const token=localStorage.getItem('token')
    if(token)
    {
            const grpname= document.getElementById('grpname').value
            try{
                const response= await axios.post('/creategrp',{grpname},{headers: { "Authorization": token }});
              //  console.log(response)
             getallGroup()
          
            }
            catch(e)
            {
                console.log(e)
                alert(e)
            }
    }
    else{
        alert('create account first')
    }

}
async function getallGroup()
{
    const token=localStorage.getItem('token')
    const parsetoken=parseJwt(token)
    try{
        const grpinfo= await axios.get(`/getallgroup/${parsetoken.id}`)
        console.log(grpinfo.data.admin)
        grpdispaly(grpinfo.data.usergroup,grpinfo.data.admin,parsetoken.id)
    }
    catch(e)
    {
        console.log(e)
    }
     
}

 function grpdispaly(groups,admin,userid)
{
    grouplist.innerHTML=""
    groups.forEach(res =>{
    
        const para= document.createElement('p')
        
        para.innerHTML=`${res.grpname}`;
        const chatbtn= document.createElement('button')
        chatbtn.textContent='see chat'
        
        para.appendChild(chatbtn)
        grouplist.appendChild(para)

        chatbtn.addEventListener('click',()=>{
            document.querySelector('.footer').style.display='block'
            localStorage.setItem('groupId',res.groupId)
            localStorage.setItem('groupname',res.grpname)
           
          messagedata()
          
         
        })
         let x;
           admin.forEach(a=>{
             if(a.id==res.groupId)
             x=a.id
           })
           
        if(x)
        {
            const adduser= document.createElement('button')
            adduser.textContent='Add User'
            const deletegrp=document.createElement('button')
            deletegrp.textContent='Delete Group';
            const remove=document.createElement('button')
            remove.textContent='Remove Member';
            const admin=document.createElement('button')
            admin.textContent='Admin';
            
            para.appendChild(adduser)
            para.appendChild(deletegrp)
            para.appendChild(remove)
            para.appendChild(admin)

            adduser.addEventListener('click',()=>{
                const email=prompt('enter email id')
                addMember(email,res)
            })

            deletegrp.addEventListener('click',()=>{deleteGroup(res)})

            remove.addEventListener('click',()=>{
                const email=prompt('Enetr email id of Member')
                removeMember(email,res)})

            admin.addEventListener('click',()=>{
                const email=prompt('Enetr email id of Member')
                changeAdmin(email,res.groupId)
            })    
    
        } 

    })

}


async function addMember(email,grp)
{
    const info={
        email:email,
        grpname:grp.grpname,
        grpid:grp.groupId
    }
    try{
        const group= await axios.post('/addmember',info)
        socket.emit('update',group.data.response.userId)
        
    }
    catch(e)
    {
        alert(e)
    
    }
}

async function deleteGroup(res)
{
    try{

        const response= await axios.delete(`/deletegrp/${res.groupId}`)
        getallGroup()
       socket.emit('deletegrp')

    }
    catch(e)
    {
        alert(e)
    }    

}

async function removeMember(email,res)
{

    const data={
        email:email,
        groupId:res.groupId
    }
    try{

        const response= await axios.post('/group/removemember',data)
     
      //  window.location.href='/chat.html'
        socket.emit('update',response.data.user.id)

    }
    catch(e)
    {
        alert(e)
    }
}

async function changeAdmin(email,groupId)
{
    const data={
        email:email,
        groupId:groupId
    }
    try{
         
        const res= await axios.post('/group/changeadmin',data)
        alert(res.data.msg)
       // window.location.href='/chat.html'
    }
    catch(e)
    {
       alert(e)
    }
   

}





