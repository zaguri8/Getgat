import { signInWithEmailAndPassword } from 'firebase/auth'
import { get, ref } from 'firebase/database'
import { useState } from 'react'
import { auth, database } from '../../firebase'
import './index.css'
export default function Auth() {

    const [isRegister, setIsRegister] = useState(false)

    const login = async (event: any) => {
        event.preventDefault()

        let email = event.target[0].value
        let password = event.target[1].value


        // network request


        const approvedEmails = await get(ref(database, '/approvedEmails')).then(query => Object.values(query.val()))

        if (approvedEmails.includes(email)) {
            try {
                const userResult = await signInWithEmailAndPassword(auth, email, password)
            } catch (e: any) {
                // Firebase: Error (auth/user-not-found).
                if (e.message === 'Firebase: Error (auth/user-not-found).') {
                    // משתמש מאושר אך לא קיים
                }
            }
            // try to sign in the user
        } else {
            // user is not approved
            alert("משתמש לא מאושר")
        }
    }



    const toRegister = () => {
        setIsRegister(true)
    }

    const toLogin = () => {
        setIsRegister(false)
    }

    return <div className='wrapper'>
        <div className='container'>

            {isRegister ? <form onSubmit={login}>

                <input placeholder='Enter full name'
                    type={'text'} />


                <input placeholder='Enter age'
                    type={'number'} />
                <input placeholder='Enter address'
                    type={'text'} />
                <input placeholder='Enter email address'
                    type={'email'} />
                <input placeholder='Enter password'
                    type={'password'} />

                <button type="submit">Register</button>
            </form> : <form onSubmit={login}>
                <input placeholder='Enter email address'
                    type={'email'} />
                <input placeholder='Enter password'
                    type={'password'} />
                <button type="submit">Login</button>
            </form>}
            {isRegister ? <label onClick={toLogin}>משתמש ותיק ? התחבר</label>
                : <label onClick={toRegister}>משתמש חדש ? הרשם</label>}

        </div>
    </div>
}