<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";

import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerification from "./pages/OtpVerification";

import AdminDashboard from "./pages/AdminDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OtpVerification />} />

      {/* ================= PROTECTED ROUTES ================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ngo"
        element={
          <ProtectedRoute allowedRoles={["ngo"]}>
            <NgoDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/volunteer"
        element={
          <ProtectedRoute allowedRoles={["volunteer"]}>
            <VolunteerDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;
=======
 
import {Route, BrowserRouter, Routes, Router} from 'react-router-dom'
import './index.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'
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
import ProtectedRoute from './components/ProtectRoute.jsx'

function App() {

  return (
    
    <BrowserRouter>
     <Toaster/>
    <Routes>
     
        {/* routes without sidebar */}
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/verify-register-otp" element={<OtpVerification />} />
  
      <Route element={<Layout/> }>
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/opportunities" element={<Opportunities />} />
      <Route path="/schedule" element={<SchedulePickup/>}/>
      <Route path="/create-opportunity" element={<CreateOpportunity/>} />
      <Route path="/opportunity/:id" element={<OpportunityDetails/>}/>
<Route
  path="/schedule-page" element={<SchedulePickupPage />}/>
<Route
  path="/schedule"
  element={ <SchedulePickup />}
/>
      <Route path="/edit-opportunity/:id" element={<EditOpportunity />} />
      <Route path="/messages" element={<Messages/>} />
      <Route path="/my-profile" element={<MyProfile/> } />
    </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
>>>>>>> 5e988b0
