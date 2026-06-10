import React, {useState, useEffect, useActionState} from 'react';
import Item from './components/item';
import List from './components/List';
import Search from './components/Search';
import useSemiPersistentState from './hooks/useSemiPersistentState';
import styles from './App.module.css';

// Action para simular a adição de uma story no banco de dados
async function addStoryAction(prevState, formData){
  const title = formData.get('title');
  const author = formData.get('author');

  console.log("Simulando adição de story: ", {title, author});


  await new Promise(resolve => setTimeout(resolve,1000));


  if( !title || !author){
    return {success: false, message: 'Título e autor são obrigatórios!'};
  } 

  return {success: true, message: `Story '${title}' adicionada com sucesso!`};

}

function App() {

  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem('searchTerm') || ''
  );

  const [stories, setStories] = useState([]);          // estados das stories
  const [isLoading, setIsLoading] = useState(false);  // estado de carregamento
  const [isError, setIsError] = useState(false);      // estado de erro

  const [submissionState, submissionStoryAction] = useActionState(addStoryAction, null);

  
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

  // efeit para buscar dados da API
  useEffect(() =>{
    setIsLoading(true);
    setIsError(false);

    fetch(`https://hn.algolia.com/api/v1/search?query=${searchTerm}`)
      .then(response => response.json())
      .then(result => {
        setStories(result.hits);  // atualiza o estado com as stories
        setIsLoading(false);      // finaliza o carregamento
      })
      .catch(() => {
        setIsError(true);   // define o estado de erro
        setIsLoading(false);// finaliza o carregamento
      });
      
  },[searchTerm])

  // Lógica de filtro (antiga)
  // const filteredList = stories.filter(
  //   function (item){
  //     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  //   }
  // )

  // Com verificação de erro
    const filteredList = stories.filter(function (item) {
      const title = (item && (item.title || item.story_title) || '').toLowerCase();
        return title.includes(searchTerm.toLowerCase());
      }
    );
  

  // renderizar elementos na tela
  return (
   <div className={styles.container}>
      <h1 className={styles.header}>Minhas Histórias Hacker</h1>
      <Search onSearch={handleChange} searchTerm={searchTerm} />

      <p>Mostrando resultados para "{searchTerm}"</p>

      <hr />

      {/* Se isError é true, renderizar logo em seguida o conteúdo após '&&' */}
      {isError && <p>Algo deu errado ao carregar as histórias.</p>}

      {isLoading ?
        (<p>Carregando histórias...</p>) // se isLoading == true
        :
        (<List list={filteredList}/>)    // se isLoading == false
      }

      <hr/>

      <h2>Adicionar Novo Story</h2>
      <form action={submissionStoryAction}>
        <div>
          <label htmlFor="title">Título: </label>
          <input id="title" name="title" type="text" />
        </div>
        <div>
          <label htmlFor="author">Autor: </label>
          <input id="author" name="author" type="text" />
        </div>
        <button type="submit">Adicionar</button>
        {submissionState?.message && (
          <p style={{color: submissionState.success ? 'green' : 'red'}}>
            {submissionState.message}
          </p>
        )}
      </form>
      
    </div>
  );
}

export default App;