import * as React from 'react';
import item from './componentes/item';
import List from './componentes/List';
// . significa o ditório atual
// '/components' significa a pasta 'components'
// ele busca esta pasta no diretório atual

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
];

function App(){
  return (
    <div>

      <h1>Minhas historias Hacker</h1>

      {/* barra de busca */}


      <label htmlFor="search">Procurar:</label>
      <input type="text" id="search" />

     <hr />
      {/*
        <ListFunction listParameter={list}/>
        O primeiro "List", é a função.
        O segundo "list" é o parâmetro da função.
        O terceiro "list", é a lista criada no início do código.
      */}
      <List list={list} />
    </div>
  );
}

export default App;