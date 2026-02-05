import React from "react";
import { useState, useContext } from "react";
import { userContext } from '../App';
import { useDispatch, useSelector } from "react-redux";
import { toggleLeaderboard } from "../GamePage/GameSlice";
import { NavLink } from 'react-router-dom';
import './Home.css';
import TET1 from '../img/tet1.png';
import TET2 from '../img/tet2.png';

function Background(props) {
    const images = []
    for (let i = 0; i < props.imgStyle.length; i++)
    {
        images.push(<div className={props.imgStyle[i][0]} style={props.imgStyle[i][1]} />);
    }
    return (
        <div>
            {images}
        </div>
    );
}

function Title() {
    return (
        <div className="title">
            <img src={TET1} alt="TET1" className="popup1" />
            <div className="titleLine" />
            <img src={TET2} alt="TET2" className="popup2" />
        </div>
    );
}

function Select() {
    return (
        <div className="select">
            <NavLink to="/game">
                <button className="startButton">START</button>
            </NavLink>
        </div>
    );
}

function Leaderboards(props) {

    function showLeaderboard() {
        props.dispatch(toggleLeaderboard());
    }

    return (
        <div className="leaderboards">
            Leaderboards&nbsp;<button className="seeLeaderboardButton" onClick={showLeaderboard}>≡</button>
        </div>
    );
}

function Leaderboard(props) {

    function showLeaderboard() {
        props.dispatch(toggleLeaderboard());
    }

    function deleteRecord(num) {
        const copy = [];
        for (let i = 0; i < props.scores.length; i++) if (i != num) copy.push(props.scores[i]);
        props.setScores(copy);
    }

    function editRecord(num) {
        const newScore = prompt("Edit score:", props.scores[num][1]);
        if (newScore === null) return;
        const scoreNum = Number(newScore);
        if (Number.isNaN(scoreNum)) return;
        const obj = [props.scores[num][0], scoreNum];
        const copy = [];
        for (let i = 0; i < props.scores.length; i++) if (i !== num) copy.push(props.scores[i]);
        const pos = copy.findIndex(e => e[1] < obj[1]);
        if (pos === -1) copy.push(obj);
        else copy.splice(pos, 0, obj);
        props.setScores(copy);
    }

    const write = [];
    for (let i = 0; i < props.scores.length; i++)
    {
        write.push(<li className="data">
            <span className="nameText">{props.scores[i][0]}</span>
            <span className="scoreText">{props.scores[i][1]}</span>
            <button className="deleteButton" onClick={() => deleteRecord(i)}>✖</button>
            <button className="editButton" onClick={() => editRecord(i)}>✎</button>
        </li>);
    }

    return (
        <div className={props.leaderboardVisible ? "leaderboard" : "hide"}>
            <button className="leaderboardCloseButton" onClick={showLeaderboard}>✖</button>
            <div>
                <ul className='test'>
                    {write}
                </ul>
            </div>
        </div>
    );
}

function LogIn(props) {

    function clickListener() {
        let newName = prompt("Enter your username:", props.playerName);
        if (newName != "") props.setPlayerName(newName);
    }

    return (
        <div className='login'>
            <button className='logInButton' onClick={clickListener}>Username</button> {props.playerName}
        </div>
    );
}

function Version() {
    return (
        <div className='version'>
            version 1.0.0
        </div>
    );
}

function Developer() {
    return (
        <div className='developer'>
            Thanks for playing!
        </div>
    );
}

function Home() {
    const { v1, v2 } = useContext(userContext);
    const [imgStyle, setImgStyle] = useState([
        ["bg img7", {top: "82%", left: "85%", animation: "animate 10s linear infinite"}],
        ["bg img6", {top: "72%", left: "60%", animation: "animate 15s linear infinite"}],
        ["bg img2", {top: "85%", left: "35%", animation: "animate 12s linear infinite"}],
        ["bg img4", {top: "77%", left: "7%", animation: "animate 9s linear infinite"}],
        ["bg img1", {top: "25%", left: "11%", animation: "animate 14s linear infinite"}],
        ["bg img5", {top: "17%", left: "45%", animation: "animate 7s linear infinite"}],
        ["bg img3", {top: "25%", left: "75%", animation: "animate 13s linear infinite"}]
    ]);
    const [scores, setScores] = v1;
    const [playerName, setPlayerName] = v2;
    const leaderboardVisible = useSelector((state) => state.game.leaderboardVisible);
    const dispatch = useDispatch();

    return(
        <div className="wallpaper">
            <Background imgStyle={imgStyle} setImgStyle={setImgStyle}/>
            <Title />
            <Select />
            <Leaderboards dispatch={dispatch}/>
            <Leaderboard leaderboardVisible={leaderboardVisible} scores={scores} setScores={setScores} dispatch={dispatch}/>
            <LogIn playerName={playerName} setPlayerName={setPlayerName}/>
            <Version />
            <Developer />
        </div>
    );
}

export default Home;

