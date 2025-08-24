import { BrowserRouter, Routes, Route }  from "react-router-dom"
import Login from "./Login"
import Signup from "./Signup"
import ForgotPassword from "./ForgotPassword"
import Homepage from "./Homepage"
import Forum from "./Forum"
import CropRecommendation from './CropRecommendation'

function App() {
  return (
    <>
    <BrowserRouter>
     <Routes>
       <Route path="/login" element={<Login/>} />
       <Route path="/signup" element={<Signup/>} />
       <Route path="/forgotpassword" element={<ForgotPassword/>} />
       <Route path="/" element = {<Homepage/>} />
       <Route path="/forum" element = {<Forum/>} />
       <Route path="/crop-recommendation" element={<CropRecommendation/>}/>
     </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
