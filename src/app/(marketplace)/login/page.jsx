'use client';
import { useState } from 'react';
import './style.css';
import { AccountsBaseUrl } from '@/utils/GlobalVariables';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import cookie from 'cookie';
import useAuth from '@/hooks/useAuth';
import { Input, Modal, Typography } from 'antd';

const Login = () => {
  const { login } = useAuth();
  const router = useRouter()
  const [isLoggin, setIsLoggin] = useState(true)
  const [isPassword, setIsPassword] = useState(false)
  const [isVerify, setIsVerify] = useState(false)
  const [isValidate, setIsValidate] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [state, setState] = useState({login_username:'', password:'', email:'',username:'',password1:'',password2:'', otp: ''})
  const [errors, setErrors] = useState({
    login_username: null,
    login_password: null,
    email:null,
    usename:null,
    password1:null,
    password2:null,
    otp:null,
  })
  const [loading, setLoading] = useState({
    loging: false,
    signup: false,
    verify: false,
    validate: false,
  })
  const handleChange = (e) => {
    const {name, value} = e.target
    console.log("name==>",name);
    console.log("value==>",value);
    setState((prev) => ({ ...prev, [name]: value }));
    setErrors(null)
    if(name === 'password1'){
      passwordStrength()
    }
  }

  const verifyEmail = async () => {
    console.log("clicked--");
    
      const re = /\S+@\S+\.\S+/; // Basic email format regex
      let test = re.test(state.email)
      console.log("TESt: " + test);
      
      if (!test){
        toast.error("Please enter valid email.");
        
      }
      else{
        setLoading((prev) => ({...prev,validate:true}))
        try {
          const response = await fetch(AccountsBaseUrl+'/v1/user/resend-email/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': 'Bearer your-auth-token',
            },
            body: JSON.stringify({email:state.email} ),
          })
          .then(response => response.json())
          .then(data => {
            console.log("data===>",data);
            if (data.status_code === 1000) {
                toast.success(data.message)
                setIsValidate(false)
                setIsLoggin(false)
                setIsVerify(true)
            }else if (data.status_code === 1001){
              toast.error(data.message)
            } else {
                console.error('Failed call api');
            }
          })
      } catch (error) {
          console.error('Error api call:', error);
      } 
      setLoading((prev) => ({...prev,validate:false}))
      }
    
    
  };

  const handleLogin = async () => {
    console.log("state===>",state);
    let isValid = true
    if(state.login_username === '' || state.login_username === null){
      setErrors((prev) => ({...prev, login_username:"Please enter valid username or email!"}))
      isValid = false
    }
    if(state.password === ''){
      setErrors((prev) => ({...prev, login_password:"Please enter valid password!"}))
      isValid = false
    }
    if (isValid){
      setLoading((prev) => ({...prev,login:true}))
      const payload = {
        username: state.login_username,
        password: state.password
      }
      login(state.login_username, state.password);
    //   const response = await fetch(AccountsBaseUrl+'/v1/user/login/', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         // 'Authorization': 'Bearer your-auth-token',
    //     },
    //     body: JSON.stringify(payload ),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log("data===>",data);
    //   if (data.status_code === 1000) {
    //       console.log('Login successfully!');
    //       // ====== Login Success =================
    //       toast.success(data.message)
    //       if (isAdmin) {
    //         router.push('/admin')
    //       }else {
    //         router.push('/')
    //       }
    //   }else if(data.status_code === 1001){
    //     toast.error(data.message)
    //   }
    //   setLoading((prev) => ({...prev,login:false}))
    
    // })
    }
  }

  const passwordStrength = function () { 
    const power = document.getElementById("power-point"); 
    let point = 0;
    let value = state.password1;
    let widthPower =  
        ["1%", "25%", "50%", "75%", "100%"]; 
    let colorPower =  
        ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"]; 
  
    if (value.length >= 5) { 
        let arrayTest =  
            [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/]; 
        arrayTest.forEach((item) => { 
            if (item.test(value)) { 
                point += 1; 
            }
        }); 
    }
    power.style.width = widthPower[point]; 
    power.style.backgroundColor = colorPower[point];
};

  const handleRegister = async () => {
   let isValid = true
   if(state.email === ''){
    setErrors((prev) => ({...prev, email:"Please enter valid email!"}))
    isValid = false
  }
  if(state.username === ''){
    setErrors((prev) => ({...prev, username:"Please enter valid username!"}))
    isValid = false
  }
   if (state.password1.length < 6){
    setErrors((prev) => ({...prev, password1:"Password need min 6 letter length!"}))
    isValid = false
   }else if (state.password1 !== state.password2){
    setErrors((prev) => ({...prev, password1:"Password mismatch!"}))
    isValid = false
   }

   if(isValid){
    const payload = {
      'username':state.username,
      'email':state.email,
      'password1':state.password1,
      'password2':state.password2,
    }
    setLoading((prev) => ({...prev,signup:true}))
    try {
      const response = await fetch(AccountsBaseUrl+'/v1/user/signup/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              // 'Authorization': 'Bearer your-auth-token',
          },
          body: JSON.stringify(payload ),
      })
      .then(response => response.json())
      .then(data => {
        console.log("data===>",data);
        if (data.status_code === 1000) {
            console.log('Registered successfully!');
            toast.success(data.message)
            // message.success(data.message)
            setIsVerify(true)
        }else if (data.status_code === 1001){
          console.log("data.message==>",data.message);
          let field_name = null
          toast.error(data.message)
          // if (!data.check_username){field_name = 'username'}
          // else if (!data.check_email){field_name = 'email'}
          // else if (!data.check_password){field_name = 'password1'}
          // if (field_name){
          //   form.setFields([{
          //       name: field_name,
          //       errors: [data.message],
          //     }]);
          // }else{
          //   message.error(data.message)
          // }
        } else {
            console.error('Failed to sync notes');
        }
        setLoading((prev) => ({...prev,signup:false}))


      })
  } catch (error) {
      console.error('Error syncing notes:', error);
  } 
   }
  }


  const handleVerify = async () => {
   let isValid = true
   if(isValid){
    const payload = {
      'email':state.email,
      'otp':state.otp,
    }
    setLoading((prev) => ({...prev,verify:true}))

    try {
      const response = await fetch(AccountsBaseUrl+'/v1/user/verify-email/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              // 'Authorization': 'Bearer your-auth-token',
          },
          body: JSON.stringify(payload ),
      })
      .then(response => response.json())
      .then(data => {
        console.log("data===>",data);
        if (data.status_code === 1000) {
          console.log('Verify successfully!');
          setState({login_username:'', password:'', email:'',username:'',password1:'',password2:'', otp: ''})
          toast.success(data.message)
          // ====== Verificcation Success =================
          setIsVerify(false)
          setIsLoggin(true)
        }else if (data.status_code === 1001){
          console.log("data.message==>",data.message);
          let field_name = null
          toast.error(data.message)
        } else {
            console.error('Failed to sync notes');
        }
        setLoading((prev) => ({...prev,verify:false}))
        
      })
  } catch (error) {
      console.error('Error syncing notes:', error);
  } 
   }
  }




  return (
    <div className="main">
      <div className="signup-wrapper">
        <h2>{isLoggin ? isAdmin ? 'Admin Login' : 'Login' : 'Sign Up'}</h2>
        <p>{isLoggin ? 'Login to your account!' : 'Create your own account!'}</p>
        <div className="signup-form">
          {isLoggin ?
          <>
            <input name='login_username' onChange={handleChange} value={state.login_username} id="usename" className='' type="text" placeholder="Enter email / username" />
            <span className='text-left pl-1 text-[#e5484d]'>{errors?.login_username}</span>
            <input 
              name='password'
              onChange={handleChange}
              id="password" 
              type="password" 
              placeholder="Password"
              className='mt-3'
            />
            <span className='text-left pl-1 text-[#e5484d]'>{errors?.login_password}</span>
            <span className='text-left cursor-pointer text-slate-400 mt-3 mb-3'>Did you forget your password?</span>
            <button disabled={loading.loging} type="submit" onClick={handleLogin}>{loading.loging ? 'Please wait...' : 'Log In'}</button>
            <span onClick={() => {setIsLoggin(false)}} className='cursor-pointer m-2'>Create Account</span>
            <span onClick={() => {setIsValidate(true)}} className='cursor-pointer mb-2 text-slate-300'>Validate Account</span>
            {/* {isAdmin ?
            <span onClick={() => {setIsAdmin(false)}} className='cursor-pointer text-slate-300'>User Login</span>
            :
            <span onClick={() => {setIsAdmin(true)}} className='cursor-pointer text-slate-300'>Admin Login</span>
            } */}
          </>
          :
          <>
            <input disabled={isVerify} name='email' value={state.email} onChange={handleChange} type="email" placeholder="Your email" />
            <span className='text-left pl-1 text-[#e5484d]'>{errors?.email}</span>
            <input disabled={isVerify} name='username' value={state.username} onChange={handleChange} type="text" className='mt-3' placeholder="Your username" />
            <span className='text-left pl-1 text-[#e5484d]'>{errors?.usename}</span>
            
            {isVerify ?
            <>
              <input 
                name="otp" 
                type="text" 
                placeholder="OTP"
                className='mt-3'
                value={state?.otp}
                onChange={handleChange}
              />
              <span className='text-left pl-1 text-[#e5484d]'>{errors?.otp}</span>
              <button disabled={loading.verify} type="submit" className='mt-3' onClick={handleVerify}>{loading.verify ? 'Please wait...' : 'Verify OTP'}</button>
            </>
            : 
            <>
              <input 
                name="password1" 
                type="text" 
                placeholder="Password"
                className='mt-3'
                value={state?.password1}
                onChange={handleChange}
              />
              <span className='text-left pl-1 text-[#e5484d]'>{errors?.password1}</span>
              <input 
                id="confirm-password" type="password" className='mt-3' name='password2' value={state?.password2} onChange={handleChange}
                placeholder="Repeat Password" />
                <div className="power-container mt-3"> 
                    <div id="power-point"></div> 
                </div>
                <button type="submit" className='mt-3' onClick={handleRegister} disabled={loading.signup}>{loading.signup ? 'Please wait...' : 'Sign Up'}</button>
            </>
            }
              
            <span onClick={() => {setIsLoggin(true)}} className='cursor-pointer mt-3' >Back to Login!</span>
          </>
          }
        </div>
      </div>

      <Modal
        title="Verify your email"
        centered
        open={isValidate}
        onOk={() => verifyEmail()}
        onCancel={() => setIsValidate(false)}
        okText="Verify"
        okButtonProps={{loading: loading.validate}}
      >
        <div>
          <Typography >Email</Typography>
          <Input type='email' name='email' onChange={handleChange} value={state.email} />
        </div>
      </Modal>
    </div>
  )
}

export default Login