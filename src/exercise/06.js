// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useState, useEffect} from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonDataView, PokemonForm, PokemonInfoFallback, fetchPokemon} from '../pokemon'

class ErrorBoundary extends React.Component {
  state = {error: null}
  static getDerivedStateFromError(error) {
    return {error}
  }

  // equivalent of body of function component
  render() {
    const {error} = this.state
    if (error) {
      // generic use of fallback to pass into errors
      return <this.props.FallbackComponent error />
    }
    console.log('Error Boundary', this.state.error)
    return this.props.children

  }
}

function PokemonInfo({pokemonName}) {

  const [{status, pokemon, error}, setState] = useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })
  // state updates to new object when called
  console.log({status, pokemon, error})

  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  useEffect(() => {
    // if pokemon name not given, do nothing
    if (!pokemonName) {
      return
    }
    // reset to loading state before fetching
    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({pokemon,status: 'resolved'})
       },
      error => {
        setState({error, status: 'rejected'})
      }
    )
  }, [pokemonName])
  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName}/>
  } else if (status === 'rejected') {
    // error handled by error boundary
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  throw new Error('this should be impossible')
}

// fallback error
function ErrorFallBack({error}) {
  return (
    <div role="alert">
      There was an error: {' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  ) 
}

function App() {
  const [pokemonName, setPokemonName] = useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {/* key prop unmounts and reounts using key */}
        <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallBack}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
        
      </div>
    </div>
  )
}

export default App
