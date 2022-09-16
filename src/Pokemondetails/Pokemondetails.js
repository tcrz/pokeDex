import './Pokemondetails.css'
import { Link, useLocation } from "react-router-dom";
import {useEffect, useState } from 'react'
import Loader from '../Loader/Loader';


function pokemonStats(stats) {
  let statsDetails = []
  stats.forEach((data) => {
    let statData = {}
    let name = data.stat.name
    statData.name = name.charAt(0).toUpperCase() + name.slice(1)
    statData.value = data.base_stat
    statsDetails.push(statData)
  })
  return statsDetails
}

export default function Pokemondetails() {
  const [pokemonDetails, setPokemonDetails] = useState({})
  let location = useLocation();

  const extractPokemonDetails = (url) => {
    fetch(url)
      .then(response => response.json())
      .then((response) => {
        let pokemonInfo = { types: [], moves: [] }
        const data = response
        pokemonInfo.name = data.name.toUpperCase()
        pokemonInfo.species = data.species.name
        pokemonInfo.weight = data.weight
        pokemonInfo.image = data.sprites.other["official-artwork"].front_default
        pokemonInfo.stats = pokemonStats(data.stats)
        data.types.forEach(type => pokemonInfo.types.push(type.type.name))
        data.moves.slice(0, 10).forEach(move => pokemonInfo.moves.push(move.move.name))
        setPokemonDetails(pokemonInfo)
      })
  }

  useEffect(() => {
    extractPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${location.state.name}`)
  }, [location.state.name])

  const {name, image, species, weight, stats, types, moves} = pokemonDetails
  return(
    <>
    <div className="pokemon-details-body">
    {Object.keys(pokemonDetails).length === 0 ? <Loader/> : <div className="pokemon-details-box">
        <Link to={-1} className="return-link"><p>Return to Pokedex</p></Link>
         <div className="pokemon-details">
          <h2>{name}</h2>
          <img src={image} alt={name} className="pokemon-image"/>
          <div className="pokemon-info">
            <div className="species">
              <h3>Species</h3>
              <p>{species}</p>
            </div>
            <div className="weight">
              <h3>Weight</h3>
              <p>{weight} lbs</p>
            </div>
            <div className="types">
              <h3>Types</h3>
              <ul className="type-names">
                {
                  types.map((type, index)=> {
                    return <li key={index}><p>{type}</p></li>
                  })
                }
              </ul>
            </div>
            <div className="stats">
              <h3>Stats</h3>
              <ul className="stat-names">
                {
                  stats.map((stat, index) => {
                  return <li key={index}><p>{stat.name}: {stat.value}</p></li>
                  })
                }
              </ul>
            </div>
            <div className="moves">
              <h3>Moves</h3>
              <ul className="move-names">
              {
                moves.map((move, index)=> {
                  return <li key={index}><p>{move}</p></li>
                })
              }
              </ul>
            </div>
          </div>
        </div>
      </div>}
    </div>
    </>
  )
}