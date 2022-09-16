# PokeDex
The Pokédex contains detailed stats for every creature from the Pokemon games.
### Features:
- List All Pokémon (with pagination)
- Show Details of a Pokémon (including name, types, weight, stats and moves)
- Text Search (pokemons can be searched by name)  

## Pagination/Presenting pokemons
The main page of the application displays the names of pokemons as well as their images.

### Process
PokeAPI allows for results to be paginated according to the [docs](https://pokeapi.co/docs/v2#resource-listspagination-section).
Specifying a limit of your choice, a number of results can be presented. eg. `https://pokeapi.co/api/v2/pokemon/?limit=5` would return 5 pokemon results.
[payload eg.]

```bash
{   "count":1154,   
    "next":"https://pokeapi.co/api/v2/pokemon/?offset=3&limit=3",   
    "previous":null,
    "results":[
        {"name":"bulbasaur","url":"https://pokeapi.co/api/v2/pokemon/1/"},  
        {"name":"ivysaur","url":"https://pokeapi.co/api/v2/pokemon/2/"},  
        {"name":"venusaur","url":"https://pokeapi.co/api/v2/pokemon/3/"}
    ]
}
```

With the `next` and `previous` keys present in the payload, it makes it possible to get the next/previous batch of results if any.
The results key gives us a list of objects, each containing two keys. `name` - the pokemon name as well as `url` - which gives a detailed account of the pokemon.
This endpoint provides us a way of getting all pokemon names but to get the pokemon images, we have to go a step further. The value in of the url key is an endpoint which gives us a detailed description of the pokemon, the images of each pokemon can be found in the `sprite` key. eg.
```bash
{
    ...
    "id": 95,
    "sprite": {
        "front_default": https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png
        "front_shiny": https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/95.png
        ...
    }
}
```
I noticed the image urls had a specific structure, the pokemon images are been retrieved based on the ID. Meaning, so long as is knew the pokemon's ID, i could simply display their images by appending their ID to any of the image key's base url.
```bash
    https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/[pokemonID].png
```

With all the necessary info obtained, I can now set them to the component state. On mount, the state of the component would be something like this:
```bash
this.state = {
      pokemons: [{name, image}, {name, image}, {name, image} ...], //contains pokemon name and image
      next: "https://pokeapi.co/api/v2/pokemon/?limit=3",
      previous: "https://pokeapi.co/api/v2/pokemon/?offset=3&limit=3",
      isLoading: false
    }
```
I can now iterate over the `pokemons` value and display the pokemon data. And By attaching event listeners to buttons, I can fetch the next or previous data with the given url values.

## Text Search
Display results of pokemons whose name contain the search text.

### Process
To properly find pokemons by name, we'd have to check through all available pokemons in the API. Looking at the pokemon endpoint above, the current count of pokemons is 1154. With this, we can return all pokemons available at once (without pagination) by setting the limit to the maximum value ie 1154. 
NB: this value may increase over time so its better to use the key `count` rather than hardcode the value `1154`. For example sake, I used the value itself:
```bash
`https://pokeapi.co/api/v2/pokemon/?limit=1154`
```
Now, when the fetch returns a response, we can check which pokemon names contain the given search text and return them as results


## Pokemon Details
Display detailed information about pokemon when pokemon card is clicked.

### Process
I passed the name of the pokemon to the PokemonDetails component. With useEffect, I fetch the pokemon data (using the name of the pokemon with the base url. eg:`https://pokeapi.co/api/v2/pokemon/Onix`), destructure the payload, extracting the pokemon's needed info:
• Stats
• Types
• Weight
• Moves 
Then I set it in state right when component mounts then render the data on screen.
I decided to display the info using a popup style approach. With the help of react-router, I was able to display the component without any refresh.