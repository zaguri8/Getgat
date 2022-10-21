import { onAuthStateChanged, User } from "firebase/auth";
import { Unsubscribe } from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from ".";
import { AppData, GetGatUser } from "../AppData";


interface FirebaseContext {
    user: Maybe<User>,
    appUser: Maybe<GetGatUser>,
    setUser: (user: User) => void,
    setAppUser: (appUser: GetGatUser) => void,
}
const FirebaseContext = createContext<FirebaseContext | null>(null)

export type Maybe<T> = T | null | undefined

export function isLoading<T>(m: Maybe<T>) {
    return m === undefined
}
export function isNotValid<T>(m: Maybe<T>) {
    return m === null
}


export const useFirebase = () => {
    const context = useContext(FirebaseContext) as FirebaseContext
    return {
        ...context,
        isLoading: isLoading(context.appUser),
        isUserNotValid: isNotValid(context.appUser),
        isUserValid: !isLoading(context.appUser) && !isNotValid(context.appUser)
    }
}
export const FirebaseContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<Maybe<User>>()
    const [appUser, setAppUser] = useState<Maybe<GetGatUser>>()
    useEffect(() => {
        let userListenerUnSub: Unsubscribe
        onAuthStateChanged(auth, async (userResult) => {
            if (userResult) {
                userListenerUnSub = AppData.listenUserDetails(userResult as User, setAppUser)
                return
            }
            setUser(null)
            setAppUser(null)
        }, (error) => {
            setUser(null)
            setAppUser(null)
            console.log(error)
        })
        return () => {
            if (userListenerUnSub)
                userListenerUnSub()
        }
    }, [])
    return <FirebaseContext.Provider value={{ user, setUser, appUser, setAppUser }}>
        {children}
    </FirebaseContext.Provider>
} 