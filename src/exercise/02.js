// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, {useEffect, useState} from 'react'

// custom hooks must start with 'use' and uses other hooks inside of it
function useLocalStorageWithState(key, defaultValue = '') {
  //passing function makes it cheap
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, setState] = useState(() => {
    console.log('get default value')
    return window.localStorage.getItem(key) || defaultValue 
    }
  )

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    console.log('use effect')
    window.localStorage.setItem(key, state)

  }, [state])

  return [state, setState]

}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName
  console.log('rendering')

  const [name, setName] = useLocalStorageWithState('name',initialName)
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
