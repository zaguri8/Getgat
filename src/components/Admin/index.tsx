import { getDownloadURL, uploadBytes } from "firebase/storage"
import React, { useEffect, useRef, useState } from "react"
import LoadingIndicator from "react-loading-indicator"
import { Navigate } from "react-router"
import { profilepicDef } from "../.."
import { AppData, Order } from "../../AppData"
import { storage } from "../../firebase"
import { useFirebase } from "../../firebase/context"
import './index.css'
import { ref as StorageRef } from 'firebase/storage'
function dataURItoBlob(dataURI: any) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;

}
const OrderItem = ({ order }: { order: Order }) => {

    return <div className="admin_order_col">
        <div className="couple_row">
            <span>
                שם מזמין
            </span>
            <span>
                {order.user.name}
            </span>
        </div>
        <div className="couple_row">
            <span>
                תאריך
            </span>
            <span>
                {order.date}
            </span>
        </div>

        <div className="couple_row">
            <span>
                כמות/מוצר
            </span>
            <span>
                {order.quantity} {order.product.name}
            </span>
        </div>

        <div className="couple_row">
            <span>
                טלפון המזמין
            </span>
            <span>
                {order.user.phone}
            </span>
        </div>
    </div>
}
export default () => {
    const context = useFirebase()
    const [orders, setOrders] = useState<Order[]>([])
    const [loadingImage, setLoadingImage] = useState(false)
    const [loadingImagePath, setLoadingImagePath] = useState<any>()
    const ref = useRef<HTMLInputElement>()
    useEffect(() => {
        if (!context.appUser || !context.appUser) return
        let unsub = AppData.getAllUserOrders(setOrders)
        return () => unsub()
    }, [])
    if (!context.appUser || !context.appUser.admin)
        return <Navigate to="/home" />


    const openFilePicker = () => {
        ref.current?.click()
    }
    const onSubmit = async (e: any) => {
        e.preventDefault()
        if (!loadingImagePath) return alert('יש לבחור תמונת מוצר')
        let name = e.target[2].value
        let price = e.target[3].value
        let desc = e.target[4].value
        if (!name ||!price || !desc) return alert('יש למלא את כל השדות')
        setLoadingImage(true)
        try {
            const r = StorageRef(storage, '/productImages')
            await uploadBytes(r, await loadingImagePath.arrayBuffer());
            const photo = await getDownloadURL(r);
            let newProduct = {
                name,
                price,
                desc,
                photo,
                id: ''
            }
            await AppData.saveProduct(newProduct);
            setLoadingImage(false)
            setLoadingImagePath(undefined)
            alert('המוצר הוסף בהצלחה!')
            e.target.reset()
        } catch (e) {
            alert(e)
        }
    }
    return <div className="page-holder">
        <h2>אזור מנהל</h2>

        <h3>הזמנות</h3>

        <div id="orders">
            {React.Children.toArray(orders.map(item => <OrderItem order={item} />))}
        </div>


        <form id="safe_area" onSubmit={onSubmit}>
            <h3>הוסף מוצר</h3>
            {loadingImage ? <div className='loading_holder'><LoadingIndicator segmentWidth={7} /></div> : <React.Fragment>
                {loadingImagePath && <label style={{ color: 'white' }}>נבחרה תמונה: {loadingImagePath.name}</label>}
                <button className='choose_img' type="button" style={{ width: '50%', marginInline: 'auto' }} onClick={openFilePicker}>
                    בחר תמונה
                    <input type={'file'} ref={ref as any} onChange={(e: any) => e.target.files.length > 0 && setLoadingImagePath(e.target.files[0])} />
                </button>
            </React.Fragment>}

            <input type="text" placeholder="הכנס שם מוצר" />
            <input type="number" placeholder="הכנס מחיר מוצר" />
            <input type="text" placeholder="הכנס תיאור מוצר" />
            <button type="submit" disabled={loadingImage}>אשר הוספת מוצר</button>
        </form>

    </div>
}