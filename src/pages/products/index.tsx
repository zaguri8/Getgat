import './index.css'
import f from '../../assets/pageimages/רקע_למוצרים_שלנו.jpg'
import f2 from '../../assets/pageimages/המוצרים_שלנו_-_רקע_לכותרת.jpg'
import f3 from '../../assets/pageimages/המוצרים_שלנו_רובטה_אדום.jpg'
import { useModal } from '../..'
import { useFirebase } from '../../firebase/context'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { AppData, Product } from '../../AppData'
import { FirebaseError } from 'firebase/app'
export default () => {
    const [products, setProducts] = useState<Product[]>([])
    const modal = useModal()

    const context = useFirebase()
    useEffect(() => {
        const unsub = AppData.getProducts(setProducts)
        return () => unsub()
    }, [])
    const selectionRef = useRef<HTMLSelectElement>()
    const makeOrder = async (p: Product) => {
        modal.close()
        let q = Number(selectionRef.current!!.value)
        await AppData.saveOrder({
            product: p,
            date: new Date().toLocaleDateString(),
            quantity: q,
            user: context.appUser!!,
            id: ''
        })
        modal.show(<div className='confirmation_order'>
            <h3 style={{margin:'0px'}}>תודה על הזמנך {context.appUser?.name}</h3>
            <span>ניצור עמך קשר בקרוב לסיום הזמנה !</span>
            <br/><br/>
            <img src = {p.photo} className={'product_img'}/>
            <br/>
            <span>{q} x {p.name}</span>
        </div>)
    }
    const deleteItem = async (p: Product) => {
        const deleteOperation = async () => {
            await AppData.deleteProduct(p)
            modal.close()
            alert('מוצר נמחק בהצלחה !')
        }
        modal.show(<div>
            <label>בטוח שתרצה למחוק את 4 {p.name}</label>
            <br /><br />
            <button onClick={deleteOperation} className="sure_del">כן מחק מוצר</button>
        </div>)

    }
    return <div className="page-holder" id='products'>

        <h2>המוצרים שלנו</h2>

        <div className='products_gallery'>
            {React.Children.toArray(products.map(product => <div className='products_wrapper'>
                <label>{product.name}</label>
                <img src={product.photo} />
                <div className='product_stack_2'>
                    <label>{product.price} ש"ח</label>
                    <button onClick={() => {
                        modal.show(<React.Fragment>
                            <label>{product.name}</label>
                            <img className='product_img' src={product.photo} />
                            <span>כמות</span>
                            <select ref={selectionRef as any} style={{ width: '50%' }}>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                            </select>
                            <button onClick={() => makeOrder(product)}>בצע הזמנה</button>
                        </React.Fragment>)
                    }}>הזמן</button>
                    {context.appUser?.admin && <React.Fragment><span className='admin_act_label'>פעולות אדמין</span> <button onClick={() => deleteItem(product)} className='delete_prod'>מחק מוצר</button></React.Fragment>}
                </div>
            </div>))}
        </div>
    </div>
}