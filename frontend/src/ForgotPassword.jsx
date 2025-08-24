import React, {useState} from 'react'
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "./Firebase"
import { useNavigate } from "react-router-dom"

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    if(!email){
        alert("please enter your email address");
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        alert("password reset link has been sent! Please check your email.");
        navigate("/login");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
  }
  return (
     <div className='relative bg-gray-100 flex flex-col justify-center items-center w-screen h-screen overflow-hidden'>
      <div className='z-10 bg-white backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md'>
        <h1 className='text-4xl font-bold text-center mb-8 text-gray-800'>Reset your password</h1>
        <div className='space-y-4'>
          <div>
            <input 
              type="email" 
              placeholder="Enter your Email to reset password"
              onChange={(e)=>setEmail(e.target.value)}
              className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
            />
          </div>
          <button 
            onClick={()=>setTimeout(()=> { 
             handlePasswordReset();
             },1500)
            } 
           className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transtion duration-200 ease-in-out'>
           Reset my password
         </button>
        </div>
      </div>
     </div>
  )
}

export default ForgotPassword