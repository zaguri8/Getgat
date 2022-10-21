import React, { createContext, FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import { Maybe, useFirebase } from './firebase/context';
import Auth from './pages/auth';
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { GetGatUser } from './AppData';
import { User } from 'firebase/auth';
import Toolbar from './components/Toolbar/Toolbar';
import Welcome from './pages/welcome';
import Sidebar from './components/Sidebar/Sidebar';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import home1 from './assets/pageimages/מסך_הבית1.jpg'
import home2 from './assets/pageimages/מסך_הבית2.jpg'
import profileimg from './assets/pageimages/הפרופיל_שלי.jpg'
import home4 from './assets/pageimages/מסך_הבית_4.jpg'
import p1 from './assets/pageimages/המוצרים_שלנו_-_רקע_לכותרת.jpg'
import p2 from './assets/pageimages/רקע_למוצרים_שלנו.jpg'

import Home from './pages/home';
import LoadingIndicator from 'react-loading-indicator'
import Products from './pages/products';
import Modal from './components/Modal/Modal';
import { useModal } from '.';
import Profile from './pages/profile';
import { arrayBuffer } from 'stream/consumers';
const AuthenticatedPage = ({ Component }: { Component: FunctionComponent<{ user: User, appUser: GetGatUser }> }) => {
  return (function WithAuth() {
    const { isLoading, isUserNotValid, appUser, user } = useFirebase()
    if (isLoading)
      return <React.Fragment>
        <LoadingIndicator segmentWidth={6} color={{ red: 0, green: 0, blue: 0, alpha: 1 }} />
        <h4 style={{ color: 'rgb(98, 135, 82)' }}>טוענים עבורך את האתר</h4>
      </React.Fragment>
    else if (isUserNotValid)
      return <Navigate to={'/auth'} />
    return <Component user={user as User} appUser={appUser as GetGatUser} />
  })()
}


function App() {
  const modal = useModal()
  const location = useLocation()
  const [image_src, setImageSrc] = useState(home1)



  useEffect(() => {

    switch (location.pathname) {

      case "/home":
        setImageSrc(home1)
        break;
      case "/products":
        setImageSrc(p2);
        break;
      case "/profile":
        setImageSrc(profileimg)
    }
  }, [location])

  const imgRef = useRef<HTMLImageElement>()

  return (
    <div className="App"
      onDrag={(e) => {
        let a = imgRef.current as HTMLImageElement
        if (e.clientX < (e.target as any).ctx) {
          a.style.transform = 'translateX(-2000px)'
        } else {
          a.style.transform = 'translateX(2000px)'
        }
        a.style.opacity = '0.1'
        e.clientX = (e.target as any).ctx
      }} onDragStart={(e) => {
        let a = imgRef.current as HTMLImageElement
        (e.target as any).ctx = e.clientX;
        a.style.transition = '.25s linear';
        (e.target as any).lastTime = new Date()
      }} onDragEnd={(e) => {
        let a = imgRef.current as HTMLImageElement
        a.style.position = 'relative'
        a.style.opacity = '1'
        let array = [home1, home2, home4, profileimg, p1]
        a.src = array[(Math.floor(Math.random() * array.length))]
        a.style.transform = 'none';
        (e.target as any).ctx = e.clientX
      }}>
      {modal.content && <Modal />}
      <Toolbar />
      <img ref={imgRef as any} className='page-image' src={image_src} loading={'lazy'}
      />
      <div className='app-wrapper'>
        <Routes>
          <Route path={'/'} element={<Navigate to={'/home'} />} />
          <Route path={'/auth'} element={<Auth />} />
          <Route path={'/products'} element={<AuthenticatedPage Component={Products} />} />
          <Route path={'/profile'} element={<AuthenticatedPage Component={Profile} />} />
          <Route path={'/home'} element={<AuthenticatedPage Component={Home} />} />
          <Route path={'*'} element={<div>עמוד לא נמצא</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
