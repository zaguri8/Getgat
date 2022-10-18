import { child, onValue, push, ref, set } from 'firebase/database';
import './App.css';
import { database } from './firebase';
import Auth from './pages/auth';

function App() {


  function saveSomeData() {

    const firstEmail = "nadavavnon@gmail.com"

    // onValue(ref(database, '/users'), (query) => {

    // })

    push(ref(database, '/approvedEmails'), firstEmail)

  }


  return (
    <div className="App">

      <Auth/>
    </div>
  );
}

export default App;
