
const signupForm = document.querySelector('#signupForm');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const phonenoInput = document.querySelector('#phoneno');
const passwordInput = document.querySelector('#password');
const erroediv= document.querySelector('#errordiv');
const p=document.querySelector('#p')

signupForm.addEventListener('submit', onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  const userDetails = {
    name: nameInput.value,
    email: emailInput.value,
    phoneno:phonenoInput.value,
    password: passwordInput.value
  }; 

  try {
    
    userDetails.name = userDetails.name[0].toUpperCase() + userDetails.name.slice(1);
    const char=emailInput.value;
    const response= await axios.get('/checkEmail')
    
     const val= await response.data.filter((review) =>
                 review.email.includes(char)); 
    
    
    if(val.length==0){
        const user= await axios.post('/signupuser',userDetails);
        alert('signed up successfully')
        clearInputs();   
    }
    else{
        
        p.innerHTML=`User Already Exist`;
    }
 
  } catch (err) {
    console.log('Error creating user:', err);
    
  }
}

function clearInputs() {
  nameInput.value = '';
  emailInput.value = '';
  phonenoInput.value = '';
  passwordInput.value = '';
}