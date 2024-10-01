import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import PostCreation from './pages/PostCreation';
import Profile from './pages/Profile';

const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null)

  return (
    <Router>
      {showLogin ? <><Login setUser={setUser} setShowLogin={setShowLogin} /></> :
        <>
          <div className='bg-slate-950 flex flex-row'>
            <Sidebar  setShowLogin={setShowLogin}/>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/profile'  element={<Profile />} exact/>
              <Route path='/post/new'element={<PostCreation />} />
            </Routes>
          </div>
        </>
      }
    </Router>
  )
}

export default App;