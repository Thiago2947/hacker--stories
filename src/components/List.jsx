import Item from './Item';

{/* Lista não ordenada que imprime os itens */}
function List({list}){
  return (
    <ul>
      {list.map(
          function (item){
            return <Item key={item.objectID} item={item} /> // self-closing tag
          }
      )}
    </ul>
  );
}

export default List;