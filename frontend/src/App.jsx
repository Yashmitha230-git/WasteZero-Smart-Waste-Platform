import {Route, BrowserRouter, Routes} from 'react-router-dom'
import './index.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'
import Opportunities from './pages/Opportunities'
import SchedulePickup from './pages/SchedulePickup'
import CreateOpportunity from './pages/CreateOpportunity'
import OpportunityDetails from './pages/OpportunityDetails'
import {Toaster} from 'react-hot-toast'
import SchedulePickupPage from './pages/SchedulePickupPage'
import EditOpportunity from './pages/Edit-Opportunity'
import Messages from './pages/Messages'
import OtpVerification from './pages/OtpVerification'
import MyProfile from './pages/MyProfile'
import Notifications from './pages/Notifications'

function App() {

  return (
    
    <BrowserRouter>
      <Toaster/>
      <Routes>
      
        {/* routes without sidebar */}
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/verify-register-otp" element={<OtpVerification />} />
  
        <Route element={<Layout/> }>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/schedule" element={<SchedulePickup/>}/>
          <Route path="/create-opportunity" element={<CreateOpportunity/>} />
          <Route path="/opportunity/:id" element={<OpportunityDetails/>}/>
          <Route path="/schedule-page" element={<SchedulePickupPage />}/>
          <Route path="/edit-opportunity/:id" element={<EditOpportunity />} />
          <Route path="/messages" element={<Messages/>} />
          <Route path="/my-profile" element={<MyProfile/> } />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
