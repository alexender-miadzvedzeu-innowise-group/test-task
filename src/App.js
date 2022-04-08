import { useEffect, useState } from "react";
import './App.css';

export default function App() {
  
  const DURATION = 1000;
  const MAX_LENGTH = 5;

  const [ list, setList ] = useState(["A", "B", "C", "D", "E"]);
  const [ inputValue, setInputValue ] = useState('');
  
  useEffect(() => {
    const rotateList = setInterval(() => {
      if (list.length > MAX_LENGTH) {
        setList(list.slice(1, list.length))
      } else {
        setList([
          ...list.slice(1, list.length), 
          ...list.slice(0, 1)
        ])
      }
    }, DURATION)
    return () => clearInterval(rotateList)
  })

  useEffect(() => {
    loadSongsList(inputValue)
  }, [inputValue])

  const loadSongsList = async name => {
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${name}&limit=${MAX_LENGTH}`);
      const { results } = await response.json();
      const sortedList = results
        .sort((a, b) => b.collectionName - a.collectionName)
        .reduce((res, val) => 
          val.collectionName ? [
            ...res,
            val.collectionName
          ] : [...val], [])
      setList([...list, ...sortedList])
    } catch (error) {
      console.log(error)
    }
  }

  const onInputChange = e => {
    setInputValue(e.target.value)
  }

  const RotatingList = () => {
    return (
      <ul className="list">
          {list.map((el, index) => (
            index < MAX_LENGTH &&<li className="list-item" key={guid()}>
              {el}
            </li>
          ))}
      </ul>
    )
  }

  const guid = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
  }
  
  return (
    <div className="app">
      <div className="container">
        <input 
          className="input" 
          placeholder="Search Band" 
          value={inputValue} 
          onChange={onInputChange}
        />
        <RotatingList />
      </div>
    </div>
  );
}

