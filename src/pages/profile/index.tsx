import React, { useEffect, useRef, useState } from 'react'
import LoadingIndicator from 'react-loading-indicator'
import { profilepicDef } from '../..'
import { AppData, Order } from '../../AppData'
import { useFirebase } from '../../firebase/context'
import './index.css'


export default () => {
    const context = useFirebase()

    const [myOrders, setMyOrders] = useState<Order[]>([])

    useEffect(() => {
        const unsubscribe = AppData.getUserOrders(context.appUser!!.id, setMyOrders)
        return () => unsubscribe()
    }, [])

    const openFilePicker = () => {
        ref.current?.click()
    }
    const ref = useRef<HTMLInputElement>()

    useEffect(() => {
        ref.current?.addEventListener('change', async (va) => {
            if (ref.current?.files) {
                setLoadingImage(true)
                let file = ref.current.files[0]
                try {
                    const buffer = await file.arrayBuffer()
                    await AppData.uploadUserImage(context.appUser!!, buffer)
                    setLoadingImage(false)
                } catch (e) { }
            }
        })
    }, [])
    const [loadingImage, setLoadingImage] = useState(false)
    return <div className='page-holder' id='profile'>

        <h2>הפרופיל שלי</h2>

        <label>{`שלום, ${context.appUser!!.name}`}</label>

        {loadingImage ? <div className='loading_holder'><LoadingIndicator segmentWidth={7} /></div> : <React.Fragment>
            <img className='profile_img' src={context.appUser?.photo ?? profilepicDef} />
            <button className='choose_img' onClick={openFilePicker}>
                בחר תמונה
                <input type={'file'} ref={ref as any}></input>
            </button>
        </React.Fragment>}
        <div className='order-list'>
            <h3>היסטוריית הזמנות</h3>
            {myOrders.length > 0 ? React.Children.toArray(myOrders.map(order => <div className='order-list-row'>
                <div className='product_stack'>
                    <img src={order.product.photo} />
                    <label>{order.product.name}</label>
                </div>
                <label>{`כמות: ${order.quantity}`}</label>
                <label>סה"כ לתשלום: ₪{Number(order.product.price) * order.quantity}</label>
                <label className='date_label_product'>{order.date}</label>
            </div>)) : <label>אין הזמנות</label>}
        </div>
    </div>
}