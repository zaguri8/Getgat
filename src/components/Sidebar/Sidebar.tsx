import { IconBrandProducthunt, IconBrandSuperhuman, IconCarTurbine, IconDetails, IconHome, IconMan, IconMenu2, IconPassword, IconPhone, IconPhoto, IconPlant, IconTree } from '@tabler/icons'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import logofull from '../../assets/FullLogo.jpg'
import { useFirebase } from '../../firebase/context'
import { LogoutButton } from '../../pages/auth'
import './Sidebar.css'
export default () => {


    const [show, setShow] = useState(false)
    const nav = useNavigate()
    const context = useFirebase()
    return <div className={show ? 'sidebar-show' : 'sidebar'} onClick={() => {
        show && setShow(false)
    }}>
        {show ? <nav>
            <img src={logofull} style={{ cursor: 'pointer' }} onClick={() => nav("/home")} />
            <IconHome width={'30px'} height={'30px'} onClick={() => nav("/home")} style={{ cursor: 'pointer' }} />
            <IconPlant width={'30px'} height={'30px'} onClick={() => nav("/products")} style={{ cursor: 'pointer' }} />

            <IconMan width={'30px'} height={'30px'} onClick={() => nav("/profile")} style={{ cursor: 'pointer' }} />
            <IconPhone width={'30px'} height={'30px'} onClick={() => window.open('https://wa.me/+972545236861', '_blank')} style={{ cursor: 'pointer' }} />
            {context.appUser && context.appUser.admin && <IconPassword width={'30px'} height={'30px'} onClick={() => nav("/admin")} style={{ cursor: 'pointer' }} />}
            <IconMenu2 width={'30px'} height={'30px'} onClick={() => setShow(false)} style={{ cursor: 'pointer' }} />
            <LogoutButton />
            <br />
        </nav> : <IconMenu2 onClick={() => setShow(true)} style={{ cursor: 'pointer' }} />}
    </div>
}