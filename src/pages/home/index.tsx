
import home1 from '../../assets/pageimages/מסך_הבית1.jpg'
import home2 from '../../assets/pageimages/מסך_הבית2.jpg'
import home3 from '../../assets/pageimages/מסך_הבית_3.jpg'
import home4 from '../../assets/pageimages/מסך_הבית_4.jpg'
import Chat from '../../chat'
import './index.css'
import f from '../../assets/pageimages/רקע_למוצרים_שלנו.jpg'

const Gallery = () => {


    return <div className='gallery'>
        <img src={home1} loading={'lazy'} />
        <img src={home2} loading={'lazy'} />
    </div>
}
export default () => {





    return <div className="page-holder" id='home'>
        <h2 className='header'>ברוכים הבאים ל GetGat! </h2>
        <div>
    
        </div>
        <Chat />
    </div>
}