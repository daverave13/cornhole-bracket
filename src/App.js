import './App.css';
import { useState } from 'react';
import Bracket from './components/Bracket';
import Registration from './components/Registration';

function App() {

  const [regMode, setRegMode] = useState(true);

  return (
    <div className="App">
      {regMode ? <Registration setRegMode={setRegMode}/> : <Bracket setRegMode={setRegMode}/>}
    </div>
  );
}

export default App;
