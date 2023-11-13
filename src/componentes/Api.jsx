import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Pagination from 'react-bootstrap/Pagination';

const PokeApi = () => {
  const [pokemonList, setPokemonList] = useState([]); // lista de nombres de pokemons
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
      .then(response => {
        setPokemonList(response.data.results);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const pokemonsPerPage = 24;
  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemonList = pokemonList.slice(indexOfFirstPokemon, indexOfLastPokemon);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const [apiError, setApiError] = useState(null);

  const handlePokemonClick = async (pokemonName) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const pokemonData = response.data;
  
      // Abrir una nueva ventana emergente y pasar datos
      const popup = window.open('', '_blank', 'width=600,height=400');
      
      // Escribir contenido HTML con estilos en la nueva ventana
      popup.document.write(`
        <html>
        <head>
          <style>
            body {
              font-family: 'Agbalumo&display=swap';
              background-color: #ff6f00;
              padding: 10px;
              text-align: center;
            }
            h2 {
              color: #d9ff00;
            }
            img {
              
                width: 250px;
                height: auto;
                margin: -30px 0;
            }
            p {
                font-family: 'Agbalumo&display=swap';
                font-size: 20px;
               
            }
          </style>
        </head>
        <body>
          <div>
            <h2>${pokemonData.name}</h2>
            <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" />
            <p>Altura: ${pokemonData.height}</p>
            <p>Peso: ${pokemonData.weight}</p>
            <p>Habilidades: ${pokemonData.abilities.map(ability => ability.ability.name).join(',')}</p>
          </div>
        </body>
        </html>
      `);
    } catch (error) {
      console.error(error);
    }
  }; 
  

  return (
    <div style={{ overflowX: 'hidden' }} className="container-fluid mt-4">
      <h1 style={{ marginBottom: '20px', backgroundColor: '#ff6f00'}}>PokeApi</h1>

      <div style={{ backgroundColor: 'yellow'}} className="row">
        {currentPokemonList.map(pokemon => (
          <div key={pokemon.url} className="col-md-2 mb-4">
            <Card style={{ marginTop: '20px'}}>
              <Card.Img variant="top" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split("/")[6]}.png`} alt={pokemon.name} />
              <Card.Body>
                <Card.Title>{pokemon.name}</Card.Title>
                <button className="btn btn-primary" onClick={() => handlePokemonClick(pokemon.name)}>
                  Ver Detalles
                </button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Pagination>
        {Array.from({ length: Math.ceil(pokemonList.length / pokemonsPerPage) }).map((_, index) => (
          <Pagination.Item key={`page-${index + 1}`} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {pokemonData && (
  <div className="mt-4">
    <h2>{pokemonData.name}</h2>
    <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
    <p>Altura: {pokemonData.height}</p>
    <p>Peso: {pokemonData.weight}</p>
    <p>Habilidades: {pokemonData.abilities.map(ability => ability.ability.name).join(',')}</p>
  </div>
)}

    </div>
  );
};

export default PokeApi;


