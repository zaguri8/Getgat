import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useFirebase } from "../firebase/context";
import './index.css'

import fx from '../assets/FullLogo.jpg'
import { IconSend } from "@tabler/icons";
import { AppData, ChatMessage } from "../AppData";
import { profilepicDef } from "..";


const NewMessageLine = () => {
    const context = useFirebase()

    const sendMessage = useCallback(async ({ message }: { message: string }) => {
        if (!message)
            return
        if (message.length < 3)
            return
        await AppData.newMessage({
            id: '',
            message,
            userId: context.appUser!!.id,
            userName: context.appUser!!.name,
            userPhoto: context.appUser!!.photo ?? profilepicDef,
            date: new Date().getTime()
        })
    }, [context])


    return <form onSubmit={(e) => {
        e.preventDefault()
        sendMessage({ message: (e.target as any)[0].value });
        (e.target as any)[0].value = '';
    }} className="chat-send-message-row">
        <input placeholder="הכנס תוכן הודעה..." />
        <button type="submit">
            שלח
        </button>
    </form>
}

export default () => {

    const [messages, setMessages] = useState<ChatMessage[]>([])
    const context = useFirebase()
    useEffect(() => {
        const unsubscribe = AppData.getChatMessages(setMessages)
        return () => unsubscribe()
    }, [])

    const isOwnSentMessage = (m: ChatMessage) => context.appUser?.id === m.userId
    return <div className="chat">
        <h3 style={{color:'white'}}>צ'אט קהילתי</h3>
        <div className="chat_holder">
            {messages.length > 0 ?  React.Children.toArray(messages.map((message, i) => {
                return <div className={isOwnSentMessage(message) ? 'chat-message-row' : 'chat-message-row-d'}>
                    <img className="chat-message-icon" src={message.userPhoto} />
                    <div className="chat-message-sender-row">
                        <label className="chat-message-sender">
                            {message.userName}
                        </label>
                        <label className="chat-message-content">
                            {message.message}
                        </label>
                    </div>
                    <label className={isOwnSentMessage(message) ? "chat-message-date" : "chat-message-date-d"} >
                        {(() => {
                            const date = new Date(message.date);
                            return date.getHours() + ":" + date.getMinutes()
                        })()}
                    </label>
                    {message.userId === context.appUser!!.id && <button className={isOwnSentMessage(message) ? 'delete' : 'delete-d'} onClick={() => AppData.deleteMessage(message)}>מחק</button>}
                </div>
            })) : <label style={{color:'white',padding:'12px'}}>אין הודעות..</label>}
        </div>
        <NewMessageLine />
    </div >
}