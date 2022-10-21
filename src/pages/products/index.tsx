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
        (async () => {
            const results = await AppData.getProducts()
            if (results instanceof FirebaseError) {
                alert(results)
                return
            }
            setProducts(results as Product[])
        })()
    }, [])
    const selectionRef = useRef<HTMLSelectElement>()
    const makeOrder = async (p: Product) => {
        modal.close()
        await AppData.saveOrder({
            product: p,
            date: new Date().toLocaleDateString(),
            quantity: Number(selectionRef.current!!.value),
            user: context.appUser!!,
            id: ''
        })
        alert(`תודה על הזמנך ${context.appUser!!.name}, ניצור עמך קשר בהקדם!`)
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
                </div>
            </div>))}
        </div>
    </div>
}