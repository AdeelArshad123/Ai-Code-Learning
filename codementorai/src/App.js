import './App.css';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Authentication from './components/Authentication';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Landing />
      <Authentication />
    </div>
  );
}

export default App;
