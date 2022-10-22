

import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth'
import { child, DatabaseReference, DataSnapshot, get, onValue, push, ref, remove, set, update } from 'firebase/database'
import { getDownloadURL, uploadBytes } from 'firebase/storage'
import { auth, database, storage } from './firebase'
import { ref as storageRef } from 'firebase/storage'

export type GetGatUser = {
    id: string
    name: string
    email: string
    admin: boolean
    address: string
    phone: string
    birthdate: string
    photo: string
    transactionAmount: string
}

export interface Product {
    id: string
    price: string
    photo: string
    name: string
}

export interface ChatMessage {
    id: string,
    userId: string,
    userName: string,
    userPhoto: string,
    date: number,
    message: string
}
export interface Order {
    id: string
    product: Product,
    quantity: number,
    date: string
    user: GetGatUser
}

export interface SignUpResult {
    error: never
    success: string | null
}

function mapData<T>(snapshot: DataSnapshot) {
    return snapshot.val() as T
}

function mapArray<T>(snapshot: DataSnapshot) {
    let a: T[] = []
    snapshot.forEach(x => {
        a.push(mapData<T>(x))
    })
    return a
}

function logError(reason: FirebaseError) {
    console.log(reason)
    alert(reason)
    return reason
}

async function withKey<T>(ref: DatabaseReference, object: { id: string }) {
    object.id = ref.key!!
    await update(ref, object)
    return object as T
}
export class AppData {
    static async approvedEmails() {
        return await get(ref(database, 'approvedEmails'))
            .then(mapArray<string>)
            .catch(logError)
    }

    static async uploadUserImage(user: GetGatUser, blob: ArrayBuffer) {
        const userImageStorageRef = storageRef(storage, "/" + user.id)
        try {
            const data = await uploadBytes(userImageStorageRef, blob)
            const downloadUrl = await getDownloadURL(userImageStorageRef)
            user.photo = downloadUrl;
            return await this.saveUserDetails(user)
        } catch (e) { alert(e) }
    }


    static async getProducts() {
        return get(ref(database, '/products'))
            .then(mapArray<Product>)
            .catch(logError)
    }

    static async saveProduct(product: Product) {
        return push(ref(database, '/products'), product)
            .then((ref) => withKey<Product>(ref, product))
            .catch(logError)
    }

    static async saveOrder(order: Order) {
        push(child(ref(database, '/orders'), order.user.id),
            { id: order.id, product: order.product })
            .then((ref) => withKey<Order>(ref, order))
            .catch(logError)
    }



    static getAllUserOrders(callback: (orders: Order[]) => void) {
        return onValue(ref(database, '/orders'), (snapshot) => {
            let all : Order[] = []
            snapshot.forEach(child => {
                const mapped = mapArray<Order>(child)
                all = [...all,...mapped]
            })
            callback(all)
        }, (e) => {
            logError(e as FirebaseError)
        })
    }


    static getUserOrders(uid: string, callback: (orders: Order[]) => void) {
        return onValue(child(ref(database, '/orders'), uid), (snapshot) => {
            const mapped = mapArray<Order>(snapshot)
            callback(mapped)
        }, (e) => {
            logError(e as FirebaseError)
        })
    }

    static getChatMessages(callback: (messaged: ChatMessage[]) => void) {
        return onValue(ref(database, '/messages'), (snapshot) => {
            const mapped = mapArray<ChatMessage>(snapshot)
            callback(mapped)
        }, (e) => {
            logError(e as FirebaseError)
        })
    }

    static async newMessage(message: ChatMessage) {
        push(ref(database, '/messages'), message)
            .then((ref) => withKey<ChatMessage>(ref, message))
            .catch(logError)
    }

    static async deleteMessage(message: ChatMessage) {
        try {
            const messages = await get(ref(database, '/messages'))
            messages.forEach(messageInner => {
                if (messageInner.key === message.id)
                    remove(messageInner.ref)
            })
        } catch (e) { }
    }


    static async getUserDetails(user: User) {
        return get(child(ref(database, '/users'), user.uid))
            .then(mapData<GetGatUser>)
            .catch(logError)
    }


    static listenUserDetails(user: User, consume: (u: GetGatUser) => void) {
        return onValue(child(ref(database, '/users'), user.uid), snap => {
            consume(mapData<GetGatUser>(snap))
        }, (e) => logError(e as FirebaseError))
    }

    static async saveUserDetails(user: GetGatUser) {
        return set(child(ref(database, '/users'), user.id), user)
            .then(() => user)
            .catch(logError)
    }

    static async signIn(email: string, pass: string) {
        const approvedEmails = await this.approvedEmails()
        if (approvedEmails as string[] && (approvedEmails as string[]).includes(email))
            return await signInWithEmailAndPassword(auth, email, pass).catch(logError)
        return null
    }

    static async signUp(
        user: GetGatUser,
        pass: string) {
        const approvedEmails = await this.approvedEmails()
        if (approvedEmails as string[] && (approvedEmails as string[]).includes(user.email)) {
            return await createUserWithEmailAndPassword(auth, user.email, pass).then(async cred => {
                user.id = cred.user.uid;
                const userDetails = await this.saveUserDetails(user)
                return userDetails
            }).catch(logError)
        }
        return null
    }
}