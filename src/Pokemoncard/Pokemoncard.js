import './Pokemoncard.css';
import { Link } from "react-router-dom";


export default function Pokemoncard(props){
  return(
    <Link to={`/pokemon/${props.name}`} 
    state={{name: props.name}} 
    className="pokemon-link">
      <article  className="pokemon">
        <img src={props.image} alt="pokemon-thumbnail"/>
        <div  className="details">
          <div  className="video-name">
            <h3>{props.name}</h3>
          </div>
        </div>
    </article>
  </Link>
  )
}