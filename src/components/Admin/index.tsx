import React, { useEffect, useState } from "react"
import { Navigate } from "react-router"
import { AppData, Order } from "../../AppData"
import { useFirebase } from "../../firebase/context"
import './index.css'


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
    useEffect(() => {
        if (!context.appUser || !context.appUser) return
        let unsub = AppData.getAllUserOrders(setOrders)
        return () => unsub()
    }, [])
    if (!context.appUser || !context.appUser.admin)
        return <Navigate to="/home" />

    return <div className="page-holder">
        <h2>אזור מנהל</h2>

        <h3>הזמנות</h3>

        <div id="orders">
            {React.Children.toArray(orders.map(item => <OrderItem order={item} />))}
        </div>

    </div>
}