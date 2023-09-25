import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';

const SignUp = (props) => {

  const [creadentials, setCreadentials] = useState({name:"",email:"",password:"",cpassword:""})
    let navigate = useNavigate();

    const handleSubmit= async(e)=>{
        e.preventDefault();
        const response= await fetch('http://localhost:5000/api/auth/createuser', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              
            },
            body: JSON.stringify({name:creadentials.name ,email:creadentials.email, password:creadentials.password}),
          });
          const json= await response.json();
          console.log(json);
          if(json.success){
            localStorage.setItem('token',json.authToken);
            navigate('/')
            props.showAlert("Account Created Successfully", "success")
          }
          else{
            props.showAlert("Invalid Credentials","danger")
          }

    }
    const onChange=(e)=>{
        setCreadentials({...creadentials,[e.target.name]: e.target.value})
    }


  return (
    <div className='container mt-3 my-3'>
      <h1>Sign-Up to Continue</h1>
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
      <label htmlFor="name" className="form-label">Name</label>
      <input type="name" className="form-control" id="name" name='name' value={creadentials.name} onChange={onChange} aria-describedby="emailHelp"/>
    </div>
    <div className="mb-3">
      <label htmlFor="email" className="form-label">Email address</label>
      <input type="email" className="form-control" id="email" name='email' value={creadentials.email}onChange={onChange}aria-describedby="emailHelp"/>
      <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
    </div>
    <div className="mb-3">
      <label htmlFor="password" className="form-label">Password</label>
      <input type="password" className="form-control" id="password" name='password'value={creadentials.password} onChange={onChange} minLength={5} required/>
    </div>
    <div className="mb-3">
      <label htmlFor="cpassword" className="form-label">Confirm Password</label>
      <input type="cpassword" className="form-control" id="cpassword" name='cpassword' value={creadentials.cpassword} onChange={onChange}/>
    </div>
    
    <button type="submit" className="btn btn-primary">Submit</button>
  </form></div>
  )
}

export default SignUp