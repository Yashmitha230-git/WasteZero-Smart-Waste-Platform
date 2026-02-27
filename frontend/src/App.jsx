 
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

function App() {

  return (
    
    <BrowserRouter>
     <Toaster/>
    <Routes>
     
        {/* routes without sidebar */}
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
  
      <Route element={<Layout/> }>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/opportunities" element={<Opportunities />} />
      <Route path="/schedule" element={<SchedulePickup/>}/>
      <Route path="/create-opportunity" element={<CreateOpportunity/>} />
      <Route path="/opportunity/:id" element={<OpportunityDetails/>}/>
      <Route path="/schedule-page" element={<SchedulePickupPage />} />
      <Route path="/edit-opportunity/:id" element={<EditOpportunity />} />
    </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
