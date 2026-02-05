import './App.css';
import { createContext, useState } from 'react';

//npm i react-router-dom
import { HashRouter, Route, Routes } from "react-router-dom";

import Home from './HomePage/Home';
import Game from './GamePage/Game';

//npm install @reduxjs/toolkit react-redux
import GameStore from './GamePage/GameStore';
import { Provider } from 'react-redux';

export const userContext = createContext();

function App() {
  const [scores, setScores] = useState([
    ["AAA", 500],
    ["BBB", 400],
    ["CCC", 300],
    ["DDD", 200],
    ["EEE", 100]
  ]);
  const [playerName, setPlayerName] = useState("Player1");

  return (
    <Provider store={ GameStore }>
      <userContext.Provider value={{ v1: [scores, setScores], v2: [playerName, setPlayerName] }}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </HashRouter>
      </userContext.Provider>
    </Provider>
  );
}

export default App;
