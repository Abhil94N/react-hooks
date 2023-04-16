// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, {useEffect, useState, useRef} from 'react'

// custom hooks must start with 'use' and uses other hooks inside of it to make it a hook
// third parameter is a list of options
function useLocalStorageWithState(key, defaultValue = '', {
  serialize = JSON.stringify,
  deserialize = JSON.parse,
} = {}) {
  //passing function makes it cheap
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, setState] = useState(() => {
    console.log('get default value')
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage) 
    }
    // supporting use case of default value is function 
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    
    }
  )
  
  // get previous key ref
  const prevKeyRef = useRef(key)
  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    console.log('use effect')
    // get the current reference of previous key
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    // set new key ref current to new key 
    prevKeyRef.current = key

    window.localStorage.setItem(key, serialize(state))
    //requres key and state, serialize
    // dependency array requires anything that changes
  }, [key, serialize, state])

  return [state, setState]

}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName
  console.log('rendering')

  const [name, setName] = useLocalStorageWithState('name',initialName)
  // nonpersistent state version instead of use localstoragewith state
  //const [name, setName] = useState(initialName)
  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)
  return <><button onClick={() => setCount(previousCount => previousCount + 1)}>{count}</button><Greeting initialName="James" /></>
}

export default App
