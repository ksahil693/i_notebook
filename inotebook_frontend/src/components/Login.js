import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'


const Login = (props) => {
    const [creadentials, setCreadentials] = useState({email:"",password:""})
    let navigate = useNavigate();

    const handleSubmit= async(e)=>{
        e.preventDefault();
        const response= await fetch('http://localhost:5000/api/auth/login', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              
            },
            body: JSON.stringify({email:creadentials.email,password:creadentials.password}),
          });
          const json= await response.json();
          console.log(json);
          if(json.success){
            localStorage.setItem('token',json.authToken);
            navigate('/')
            props.showAlert("Account Logged In Successfully", "success")
          }
          else{
            props.showAlert("Invalid Credentials","danger");
          }

    }
    const onChange=(e)=>{
        setCreadentials({...creadentials,[e.target.name]: e.target.value})
    }

  return (
    <div className="mt-3">
      <h1>Login to Continue</h1>
    <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" name="email" value={creadentials.email} onChange={onChange} aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="Password" className="form-label">Password</label>
    <input type="password" className="form-control" id="Password" name='password'value={creadentials.password} onChange={onChange} />
  </div>
  
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
</div>
  )
}

export default Login