import React from "react";
import { useEffect, useContext, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { userContext } from '../App';
import { update, moveUp, moveDown, rotate, fastFall, resetGame } from "./GameSlice";
import styles from './Game.module.css';

function Screen(props) {
    const grid = []

    for (let i = 0; i < props.map.length; i++)
    {
        for (let j = 0; j < props.map[i].length; j++)
        {
            if (props.map[i][j] == 1 || props.map[i][j] == 101) grid.push(<div className={styles.t1} />);
            else if (props.map[i][j] == 2 || props.map[i][j] == 102) grid.push(<div className={styles.t2} />);
            else if (props.map[i][j] == 3 || props.map[i][j] == 103) grid.push(<div className={styles.t3} />);
            else if (props.map[i][j] == 4 || props.map[i][j] == 104) grid.push(<div className={styles.t4} />);
            else if (props.map[i][j] == 5 || props.map[i][j] == 105) grid.push(<div className={styles.t5} />);
            else if (props.map[i][j] == 6 || props.map[i][j] == 106) grid.push(<div className={styles.t6} />);
            else if (props.map[i][j] == 7 || props.map[i][j] == 107) grid.push(<div className={styles.t7} />);
            else if (j == Math.floor(props.map[i].length / 2)) grid.push(<div className={styles.mid} />);
            else grid.push(<div className={styles.block} />);
        }
    }

    return (
        <div className={styles.screen}>
            {grid}
        </div>
    );
}

function Scoreboard(props) {
    return (
        <div className={styles.scoreboard}>
            Score : {props.score}
        </div>
    );
}

function GameOverScreen(props) {
    const dispatch = useDispatch();
    const handleGoBack = () => {
        updatedScoreboard = false;
        dispatch(resetGame());
    };
    return (
        <div className={props.gameOver ? styles.gameOverScreen : styles.hide}>
            <NavLink to="/"><button className={styles.goBackButton} onClick={handleGoBack}>▶&nbsp;</button></NavLink>
            GAME<br/>
            OVER
        </div>
    );
}

var updatedScoreboard = false;
function Game() {
    const { v1, v2 } = useContext(userContext);
    const [scores, setScores] = v1;
    const [playerName, setPlayerName] = v2;
    const side = useSelector((state) => state.game.side);
    const map = useSelector((state) => state.game.map);
    const score = useSelector((state) => state.game.score);
    const gameOver = useSelector((state) => state.game.gameOver);
    const dispatch = useDispatch();

    const handleKeyDown = useCallback((event) => {
        if (event.key === "ArrowUp") dispatch(moveUp());
        else if (event.key === "ArrowDown") dispatch(moveDown());
        else if (event.key === " ") dispatch(rotate());
        else if (event.key === "ArrowLeft" || event.key === "ArrowRight") dispatch(fastFall());
    }, [dispatch]);
    
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {document.removeEventListener('keydown', handleKeyDown);};
    }, [handleKeyDown]);
    
    useEffect(() => {
        let timeId = setInterval(() => {
            dispatch(update());
        }, 125);
        return () => { clearInterval(timeId) };
    }, []);
    if (gameOver && !updatedScoreboard)
    {
        const cpy = JSON.parse(JSON.stringify(scores));
        let obj = [playerName, score];
        let pos = cpy.findIndex(e => e[1] < score);
        if (pos == -1) cpy.push(obj);
        else cpy.splice(pos, 0, obj);
        setScores(s => {return cpy});
        updatedScoreboard = true;
    }

    return(
        <div className={`${styles.bg} ${side == 0 ? styles.startSlide : (side > 0 ? styles.slideR : styles.slideL)}`}>
            <GameOverScreen gameOver={gameOver}/>
            <Screen map={map} />
            <Scoreboard score={score}/>
        </div>
    );
}

export default Game;