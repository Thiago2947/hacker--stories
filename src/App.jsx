import React, { useState } from 'react';
import Item from './components/Item';
import List from './components/List';
import Search from './components/Search';

{/*
// '.' significa o ditório atual
// '/components' significa a pasta 'components'
// ele busca esta pasta no diretório atual 
*/}


// list de 'stories'
const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 2,
  },
];

async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem('searchTerm') || ''
  );
  const [stories, setStories] = useState([]); // Estado para as histórias da API
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
  const [isError, setIsError] = useState(false); // Estado de erro
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);
  // Efeito para buscar dados da API
  useEffect(() => {
    setIsLoading(true); // Inicia o estado de carregamento
    setIsError(false); // Reseta o estado de erro
    fetch(`https://hn.algolia.com/api/v1/search?query=${searchTerm}`)
      .then(response => response.json())
      .then(result => {
        setStories(result.hits); // Atualiza o estado com as histórias
        setIsLoading(false); // Finaliza o estado de carregamento
      })
      .catch(() => {
        setIsError(true); // Define o estado de erro
        setIsLoading(false); // Finaliza o estado de carregamento
      });
  }, [searchTerm]); // Refaz a busca sempre que searchTerm muda
  const filteredList = stories.filter(function (item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return (
    <div>
      <h1>Minhas Histórias Hacker</h1>

      <Search onSearch={handleChange} searchTerm={searchTerm} />
      <hr />
      {isError && <p>Algo deu errado ao carregar as histórias.</p>}
      {isLoading ? (
        <p>Carregando histórias...</p>
      ) : (
        <List list={filteredList} />
      )}
    </div>
  );
}
export default App;