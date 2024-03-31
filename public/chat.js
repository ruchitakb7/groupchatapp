const chatbox= document.querySelector('.container')
const chatform= document.querySelector("#chatform")
const message= document.querySelector('#message')
const sendbtn= document.querySelector('#sendbtn')
const grouplist= document.querySelector('#grplist')
sendbtn.addEventListener('click', sendMessage)


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
    chatbox.style.display='block'
    const groupname= localStorage.getItem('groupname')
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
              window.location.href='/chat.html'
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
          setInterval(messagedata, 1000)
         
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
        console.log(group)
        window.location.href='/chat.html'
        
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
        console.log(response)
        
       window.location.href='/chat.html'

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

        const user= await axios.post('/group/removemember',data)
        console.log(user.data.success)
        window.location.href='/chat.html'

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
        window.location.href='/chat.html'
    }
    catch(e)
    {
       alert(e)
    }
   

}





