const chatbox= document.querySelector('.container')
const chatform= document.querySelector("#chatform")
const message= document.querySelector('#message')
const sendbtn= document.querySelector('#sendbtn')
sendbtn.addEventListener('click', sendMessage)

window.addEventListener('DOMContentLoaded',refresh)

function refresh()
{
    messagedata()

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
    const msg= message.value;
    const token= localStorage.getItem('token')
    try{
        const res= await axios.post('/addmessage',{msg}, {headers: { "Authorization": token }})
        console.log(res.data.msg);
        message.value=""
      // messagedata()
     // messagedisplay(res.data.msg,token)
    }
    catch(e)
    {
        alert('mesage could not send try again letter')
        console.log(e)
    }   
} 
setInterval(messagedata, 1000)

async function messagedata()
{
    token= localStorage.getItem('token')
    if(token)
    {
        try{
            const response= await axios.get('/allmessage')
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



