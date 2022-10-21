import Sidebar from '../Sidebar/Sidebar'
import './Toolbar.css'
import logo from '../../assets/FullLogo_Transparent.png'
import { useNavigate } from 'react-router'
export default () => {
    const nav = useNavigate()
    return <div className="toolbar">
        <img src={logo} onClick={() => nav('/home')} style={{cursor:'pointer'}} />
      
        <Sidebar />
    </div>
}