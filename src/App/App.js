import React from 'react';
import Loader from '../Loader/Loader';
import Pokemoncard from '../Pokemoncard/Pokemoncard';
import './App.css';
import logo from './logo192.png'
import { ImSearch } from 'react-icons/im';
import { Routes, Route } from "react-router-dom";
import Pokemondetails from '../Pokemondetails/Pokemondetails';


function getPokemonIdAndImage(url) {
  const split_url = url.split("/")
  const id =  parseInt(split_url.slice(-2))
  const image_url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  return image_url
}

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      pokemons: [],
      next: "",
      previous: "",
      isLoading: false,
      searchTerm: "",
      count: null,
      searchResults: []
    }
  }

  fetchPokemonData = (url) => {
    this.setState({isLoading: true})
    fetch(url)
    .then((response)=> response.json())
    .then((data) => {
      this.setState({isLoading: false})
      this.setState({count: data.count})
      const pokemons_list = []
      data.results.forEach(item => {
        const image = getPokemonIdAndImage(item.url)
        pokemons_list.push({name: item.name, image})
      })
      this.setState({pokemons:pokemons_list})
      this.setState({previous: data.previous, next: data.next})
    })
  }

  componentDidMount() {
    const url = "https://pokeapi.co/api/v2/pokemon/?limit=16"
    this.fetchPokemonData(url)
  }

  nextPokemonData = () => {
    this.setState({pokemons: []})
    this.fetchPokemonData(this.state.next)
  }

  previousPokemonData = () => {
    this.setState({pokemons: []})
    this.fetchPokemonData(this.state.previous)
  }

  handleChangeSearchTerm = (event) => {
    this.setState({searchTerm: event.target.value}, this.searchPokemon)
  }

  searchPokemon = () => {
    const {searchTerm, count} = this.state
    if (searchTerm.length  >= 3){
    fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${count}`)
    .then((response)=> response.json())
    .then((data) => {
      const pokemons_list = []
      data.results.forEach(item => {
        if (item.name.includes(searchTerm.toLowerCase())){
          const image = getPokemonIdAndImage(item.url)
          pokemons_list.push({name: item.name, image})
        }
      })
      this.setState({searchResults:pokemons_list})
    })
    }
  }

  render() {
    const {pokemons, isLoading, previous, next, searchResults, searchTerm} = this.state
    return (
      <>
      <div className="main-body">
         <Routes>
          <Route path="/pokemon/:name" element={<Pokemondetails/>}/>
        </Routes>
        <header>
          <div className="heading">
            <img src={logo} alt="pokeball"/>
            <h1>PokeDex</h1>
          </div>
          <div className="sub-text">
            <p>The Pokédex contains detailed stats for every creature from the Pokemon games.</p>
          </div>
        </header>
       { (isLoading ? <Loader/> :
          <>
          <div className="search-box">
            <div className="search-bar">
              <input type="text" placeholder="search pokemon (3 characters mininum)" value={this.state.searchTerm} onChange={this.handleChangeSearchTerm}/>
              <ImSearch/>
            </div>
          </div>
          <div>
            <div className="pokemon-list">
                { 
                  (
                    searchTerm.length >= 3 ? ( 
                      searchResults.map((pokemon, index)=>{
                      return <Pokemoncard name={pokemon.name} image={pokemon.image} key={index}/>
                      })
                    ) : (
                      pokemons.map((pokemon, index)=>{
                      return <Pokemoncard name={pokemon.name} image={pokemon.image} key={index}/>
                      })
                    )
                  )
                }
            </div>
          </div>
          <div className="nav-btns">
              <button style={{display: previous && searchTerm.length < 3 ? "block" : "none"}} onClick={this.previousPokemonData} className="prev-btn">Previous</button>
              <button style={{display: next && searchTerm.length < 3 ? "block" : "none"}} onClick={this.nextPokemonData} className="next-btn">Next</button>
            </div>
          </>)
        }
      </div>
      </>
      );
  }
  
}

export default App;
