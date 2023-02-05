import { useFetch } from './hooks/useFetch';
import './App.css';

function App() {
  const { loading, errorMsg, data } = useFetch({
    url: 'https://pokeapi.co/api/v2/pokemonsssss',
  });

  return <div className='App'></div>;
}

export default App;
