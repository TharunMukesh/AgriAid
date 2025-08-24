import { useState }  from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { auth,db } from "./Firebase"
import { setDoc, doc , query, getDocs, collection, where} from "firebase/firestore";
import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword
} from "firebase/auth";


function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate= useNavigate();

    const registerWithEmailAndPassword = async (name, email, password) => {
        try {
            const res = await createUserWithEmailAndPassword(auth,email,password);
            const user = res.user;
            await setDoc(doc(db,"users",user.uid),{
                uid: user.uid,
                name: name,
                authProvider: "local",
                email: user.email
            });
            navigate("/login");
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };
    const googleProvider = new GoogleAuthProvider();
    const signInWithGoogle = async () => {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db,"users"), where("uid","==",user.uid));
        const docs = await getDocs(q);
        if(docs.docs.length === 0) {
            await setDoc(doc(db,"users",user.uid),{
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email
            });
        }
        navigate("/");
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    };
  return (
    <div className='relative bg-gray-100 flex flex-col justify-center items-center w-screen h-screen overflow-hidden'>
     <div className='z-10 bg-white backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md'>
      <h1 className='text-4xl font-bold text-center mb-8 text-gray-800'>Create an account</h1>
      <div className='space-y-4'>
        <div>
          <input 
            type="text" 
            placeholder="Enter your Name"
            onChange={(e)=>setName(e.target.value)}
            className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
          />
        </div>
        <div>
          <input 
            type="email" 
            placeholder="Enter your Email"
            onChange={(e)=>setEmail(e.target.value)}
            className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Enter a password"
            onChange={(e)=>setPassword(e.target.value)}
            className='w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
          />
        </div>
        <button 
            onClick={()=>setTimeout(()=> { 
              registerWithEmailAndPassword(name,email,password);
            },1500)
          } 
          className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transtion duration-200 ease-in-out'>
          Register
        </button>
        <div className='flex items-center my-4'>
            <div className='flex-1 h-px bg-gray-300'></div>
            <div className='px-4 text-gray-500 text-sm'>OR</div>
            <div className='flex-1 h-px bg-gray-300'></div>
        </div>
        <button onClick={()=>signInWithGoogle()} className='w-full flex items-center justify-center gap-2 border border-gray-300 py-3 px-4 rounded-xl hover:bg-gray-100 trastion duration-200 ease-in-out'>
          <FcGoogle className="text-xl"/>
          <span className="font-medium">Continue with Google</span>
        </button>
       </div>
     </div>
    </div>
  )
}

export default Signup