function Item({item}){
  return (
    <li key={item.objectID}>
      <span>
        <a href={item.url} target="_blank">{item.title}<br/></a>
      </span>
      <span>{item.author}<br/></span>
      <span>{item.num_comments}<br/></span>
      <span>{item.points}<br/></span>
      <br></br>
    </li>
  );
}

export default Item;