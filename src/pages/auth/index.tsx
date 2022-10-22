import { signOut } from 'firebase/auth'
import { useState } from 'react'
import LoadingIndicator from 'react-loading-indicator'
import { Navigate } from 'react-router'
import { AppData, GetGatUser } from '../../AppData'
import { auth } from '../../firebase'
import { useFirebase } from '../../firebase/context'
import './index.css'

export const LogoutButton = () => {
    const context = useFirebase()
    return context.appUser ? <button className='logout'
        onClick={() => {
            signOut(auth)
        }}>התנתק</button> : null
}
export default function Auth() {

    const [isRegister, setIsRegister] = useState(false)
    const context = useFirebase()
    const login = async (event: any) => {
        event.preventDefault()
        setLoading(true)
        let email = event.target[0].value
        let password = event.target[1].value
        await AppData.signIn(email, password)
            .then(user => {
                setTimeout(() => {
                    if (!user) alert('משתמש לא מאושר')
                    setLoading(false)
                }, 1000)
            }).catch(() => setTimeout(() => setLoading(false), 1000))
    }

    const register = async (event: any) => {
        event.preventDefault()
        setLoading(true)
        let name = event.target[0].value
        let birthdate = event.target[1].value
        let address = event.target[2].value
        let email = event.target[3].value
        let phone = event.target[4].value
        let password = event.target[5].value
        const user = {
            id: '',
            name,
            birthdate,
            address,
            admin: false,
            email,
            phone,
            transactionAmount: "0"
        } as GetGatUser
        await AppData.signUp(user, password)
            .then(user => {
                setTimeout(() => {
                    if (!user) alert('משתמש לא מאושר')
                    setLoading(false)
                }, 1000)

            }).catch(() => setTimeout(() => { setLoading(false) }, 1000))
    }



    const toRegister = () => {
        setIsRegister(true)
    }

    const toLogin = () => {
        setIsRegister(false)
    }
    const [loading, setLoading] = useState(false)
    if (context.appUser)
        return <Navigate to='/' />
    return <div className='page-holder'>
        <div className='wrapper'>

            <div className='container'>
                {loading && <div className='container_overlay'>
                    <LoadingIndicator
                        segmentWidth={10}
                        color={{ red: 255, green: 255, blue: 255, alpha: 1 }}
                    />
                </div>}
                {isRegister ? <form onSubmit={register}>

                    <input placeholder='הכנס שם מלא'
                        name='name'
                        type={'text'} />
                    <input placeholder='הכנס תאריך לידה'
                        name='birthdate'
                        type={'date'} />
                    <input placeholder='הכנס כתובת מגורים'
                        name='address'
                        type={'text'} />
                    <input placeholder='הכנס דואר אלקטרוני'
                        name='email'
                        type={'email'} />
                    <input placeholder='הכנס טלפון'
                        name='phone'
                        type={'tel'} />
                    <input placeholder='הכנס סיסמא'
                        name='password'
                        type={'password'} />

                    <button type="submit">הרשם</button>
                </form> : <form onSubmit={login}>
                    <input placeholder='הכנס דואר אלקטרוני'
                        name='email'
                        type={'email'} />
                    <input placeholder='הכנס סיסמא'
                        name='password'
                        type={'password'} />
                    <button type="submit">התחבר</button>
                </form>}
                {isRegister ? <label onClick={toLogin}>משתמש ותיק ? התחבר</label>
                    : <label onClick={toRegister}>משתמש חדש ? הרשם</label>}

            </div>
        </div>

    </div>
}