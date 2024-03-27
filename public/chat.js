const chatbox= document.querySelector('#chatbox')
//const chatform= document.querySelector("#chatform")
const message= document.querySelector('#message')
const sendbtn= document.querySelector('#sendbtn')

sendbtn.addEventListener('click', sendMessage)

//window.addEventListener('DOMContentLoaded', dispaly)

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
        const res= await axios.post('/addmessage',msg, {headers: { "Authorization": token }})
        console.log(res.data.msg);
    const para= document.createElement('p')
    para.style.width="30px";
    para.style.height="auto"
    para.innerHTML=`${res.data.msg}`
    chatbox.appendChild(para)
    message.value=""
    }
    catch(e)
    {
        console.log(e)
    }

    
}



