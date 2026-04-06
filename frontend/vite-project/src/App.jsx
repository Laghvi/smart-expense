import {BrowserRouter , Route , Routes} from "react-router-dom"
import './App.css'
import "./pages/Sidebarpages.css";
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
function App() {
  

  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element = {<Home />} />
    <Route path="/dashboard" element = {<Dashboard />} />
    <Route path = "/login" element = {<Login />} />
    <Route path="/register" element = {<Register />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/help" element={<Help />} />
    <Route path="/settings" element={<Settings />} />
   </Routes>
   </BrowserRouter>
      
        
  )
}

export default App

