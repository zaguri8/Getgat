import { useModal } from '../..'
import './Modal.css'



export default () => {
    const modal = useModal()
    return <div className='modal-container'>
        <div className='modal'>
            {modal.content}
            <button id='modal_close' onClick={() => modal.close()}>סגור</button>
        </div>
    </div>
}