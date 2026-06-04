import React, { useState } from 'react';
import Item from './components/Item';
import List from './components/List';
import Search from './components/Search';

{/*
// '.' significa o ditório atual
// '/components' significa a pasta 'components'
// ele busca esta pasta no diretório atual 
*/}


function Search({ searchTerm, onSearch }) {
  return (
    <div>
      <label htmlFor="search">Pesquisar: </label>
      <input 
        id="search" 
        type="text" 
        value={searchTerm} 
        onChange={onSearch} 
      />
    </div>
  );
}

function List({ list }) {
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID || item.id} item={item} />
      ))}
    </ul>
  );
}

function Item({ item }) {
  return (
    <li>
      <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
      <span> por {item.author}</span>
    </li>
  );
}

// ==========================================
// REACT 19 ACTIONS (Funções Assíncronas)
// ==========================================

/**
 * Action para simular a adição de uma nova história.
 * @param {Object} prevState - O estado anterior retornado pela action.
 * @param {FormData} formData - Os dados nativos do formulário HTML.
 */
async function addStoryAction(prevState, formData) {
  const title = formData.get('title');
  const author = formData.get('author');

  console.log('Simulando adição de história:', { title, author });

  // Simula um atraso de rede (1 segundo)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Validação simples de campos obrigatórios
  if (!title || !author) {
    return { 
      success: false, 
      message: 'Título e autor são obrigatórios!' 
    };
  }

  // Em uma aplicação real, a requisição HTTP seria feita aqui:
  // await fetch('/api/stories', { method: 'POST', body: formData });

  return { 
    success: true, 
    message: `História '${title}' adicionada com sucesso!` 
  };
}

// ==========================================
// COMPONENTE PRINCIPAL (App)
// ==========================================

function App() {
  // --- Estados do Filtro e Pesquisa ---
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem('searchTerm') || ''
  );

  // --- Estados da API (Hacker News) ---
  const [stories, setStories] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [isError, setIsError] = useState(false); 

  // --- Estado do Formulário (React 19 Action State) ---
  const [submissionState, submitStoryAction] = useActionState(addStoryAction, null);

  // --- Manipuladores de Evento ---
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // --- Efeito 1: Persistir o termo de busca no LocalStorage ---
  useEffect(() => {
    localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

  // --- Efeito 2: Buscar dados da API do Hacker News ---
  useEffect(() => {
    setIsLoading(true); 
    setIsError(false); 

    fetch(`https://hn.algolia.com/api/v1/search?query=${searchTerm}`)
      .then((response) => response.json())
      .then((result) => {
        setStories(result.hits); 
        setIsLoading(false); 
      })
      .catch(() => {
        setIsError(true); 
        setIsLoading(false); 
      });
  }, [searchTerm]); 

  // --- Filtragem local da lista baseada no termo de busca ---
  const filteredList = stories.filter((item) => {
    // Garante que o item possui um título válido antes de filtrar
    return item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Minhas Histórias Hacker</h1>

      {/* Seção de Busca */}
      <Search onSearch={handleChange} searchTerm={searchTerm} />
      <hr />

      {/* Renderização Condicional dos Dados da API */}
      {isError && <p style={{ color: 'red' }}>Algo deu errado ao carregar as histórias.</p>}
      
      {isLoading ? (
        <p>Carregando histórias...</p>
      ) : (
        <List list={filteredList} />
      )}

      <hr />

      {/* Formulário utilizando o novo paradigma de Actions */}
      <h2>Adicionar Nova História</h2>
      <form action={submitStoryAction}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="title">Título: </label>
          <input id="title" name="title" type="text" />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="author">Autor: </label>
          <input id="author" name="author" type="text" />
        </div>

        <button type="submit">Adicionar</button>

        {/* Feedback visual do envio do formulário */}
        {submissionState && submissionState.message && (
          <p style={{ color: submissionState.success ? 'green' : 'red', marginTop: '10px' }}>
            {submissionState.message}
          </p>
        )}
      </form>
    </div>
  );
}

export default App;