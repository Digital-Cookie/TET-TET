import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    map: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    side: 0,
    x: 4,
    y: 10,
    block: Math.floor(Math.random() * 7) + 1,
    score: 0,
    gameOver: false,
    leaderboardVisible: false,
    gameStart: false,
    gameStart2: false,
    skip: 0,
    solidate: false,
    fallCount: 0,
    blockExists: false
};

export const GameSlice = createSlice({
    name: 'game',
    initialState: initialState,
    reducers: {
        example: () => {},
        update(state) {
            if (!state.gameOver)
            {
                if (state.skip == 0)
                {
                    if (state.side < 0) GameSlice.caseReducers.fallLeft(state);
                    else GameSlice.caseReducers.fallRight(state);
                }
                state.skip++;
                if (state.skip > 4) state.skip = 0;
                if (!state.gameStart) GameSlice.caseReducers.drawBlock(state);
            }
        },
        fallRight(state) {
            const mapCopy = JSON.parse(JSON.stringify(state.map));
            state.solidate = false;
            state.fallCount = 0;
            state.blockExists = false;
            for (let i = 0; i < mapCopy.length; i++) if (mapCopy[i][mapCopy[i].length - 1] == state.block) state.blockExists = true;
            for (let i = 0, out = false; i < mapCopy.length && state.fallCount < 4 && !out; i++)
            {
                for (let j = mapCopy[i].length - 2; j >= Math.floor(mapCopy[i].length / 2) - 2 && state.fallCount < 4; j--)
                {
                    if (mapCopy[i][j] > 0 && mapCopy[i][j] < 8)
                    {
                        state.blockExists = true;
                        if (mapCopy[i][j + 1] != 0)
                        {
                            state.solidate = true;
                            out = true;
                            break;
                        }
                        else
                        {
                            mapCopy[i][j + 1] = mapCopy[i][j];
                            mapCopy[i][j] = 0;
                            state.fallCount++;
                        }
                    }
                }
            }
            if (!state.solidate && state.fallCount == 4)
            {
                state.map = mapCopy;
                if (state.y < state.map[state.x].length - 1) state.y++;
            }
            GameSlice.caseReducers.solidation(state);
        },
        fallLeft(state) {
            const mapCopy = JSON.parse(JSON.stringify(state.map));
            state.solidate = false;
            state.fallCount = 0;
            state.blockExists = false;
            for (let i = 0; i < mapCopy.length; i++) if (mapCopy[i][0] == state.block) state.blockExists = true;
            for (let i = 0, out = false; i < mapCopy.length && state.fallCount < 4 && !out; i++)
            {
                for (let j = 1; j <= Math.floor(mapCopy[i].length / 2) + 1 && state.fallCount < 4; j++)
                {
                    if (mapCopy[i][j] > 0 && mapCopy[i][j] < 8)
                    {
                        state.blockExists = true;
                        if (mapCopy[i][j - 1] != 0)
                        {
                            state.solidate = true;
                            out = true;
                            break;
                        }
                        else
                        {
                            mapCopy[i][j - 1] = mapCopy[i][j];
                            mapCopy[i][j] = 0;
                            state.fallCount++;
                        }
                    }
                }
            }
            if (!state.solidate && state.fallCount == 4)
            {
                state.map = mapCopy;
                if (state.y > 0) state.y--;
            }
            GameSlice.caseReducers.solidation(state);
        },
        solidation(state) {
            if (state.solidate || (state.fallCount == 0 && state.blockExists))
            {
                for (let i = 0; i < state.map.length; i++) for (let j = 0; j < state.map[i].length; j++) if (state.map[i][j] == state.block) state.map[i][j] += 100;

                state.score += 4;
                state.x = 4;
                state.y = 10;
                state.block = Math.floor(Math.random() * 7) + 1;

                GameSlice.caseReducers.checkLineFill(state);

                GameSlice.caseReducers.checkGameOver(state);

                GameSlice.caseReducers.drawBlock(state);
                if (!state.gameOver) state.side = state.side < 0 ? 1 : -1;
                state.gameStart2 = true;
            }
        },
        checkLineFill(s) {
            let linesCleared = 0;
            let start = s.side < 0 ? 0 : s.map[0].length - 1;
            for (let j = start; (j != Math.floor(s.map[0].length / 2)) && s.gameStart2; j -= s.side)
            {
                let isFilled = true;
                for (let i = 0; i < s.map.length; i++) if (s.map[i][j] == 0) isFilled = false;
                if (isFilled)
                {
                    for (let i = 0; i < s.map.length; i++)
                    {
                        for (let k = j - s.side; k != Math.floor(s.map[0].length / 2); k -= s.side)
                        {
                            s.map[i][k + s.side] = s.map[i][k];
                        }
                    }
                    j += s.side;
                    linesCleared++;
                }
            }
            if (linesCleared == 1) s.score += 10;
            if (linesCleared == 2) s.score += 20 + 5;
            if (linesCleared == 3) s.score += 30 + 20;
            if (linesCleared == 4) s.score += 40 + 50;
        },
        checkGameOver(state) {
            let isTouching = false;
            if ((state.block == 2 || state.block == 5) && state.map[5][9] != 0) isTouching = true;
            if ((state.block == 6 || state.block == 7) && state.map[4][9] != 0) isTouching = true;
            if ((state.block == 3 || state.block == 4 || state.block == 7) && state.map[5][11] != 0) isTouching = true;
            if ((state.block == 4 || state.block == 5 || state.block == 6) && state.map[5][11] != 0) isTouching = true;
            for (let i = 0; i < state.map.length; i++) if (state.map[i][Math.floor(state.map[i].length / 2)]) isTouching = true;
            if (isTouching) state.gameOver = true;
        },
        drawBlock(s) {

            const Blocks = [
                {I: [[
                        [0, 0, 1, 0],
                        [0, 0, 1, 0],
                        [0, 0, 1, 0],
                        [0, 0, 1, 0]
                    ], [
                        [0, 0, 0, 0],
                        [1, 1, 1, 1],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0]
                    ]
                ]},
                {J: [[
                        [0, 2, 0],
                        [0, 2, 0],
                        [2, 2, 0]
                    ], [
                        [2, 0, 0],
                        [2, 2, 2],
                        [0, 0, 0]
                    ], [
                        [0, 2, 2],
                        [0, 2, 0],
                        [0, 2, 0]
                    ], [
                        [0, 0, 0],
                        [2, 2, 2],
                        [0, 0, 2]
                    ]
                ]},
                {L: [[
                        [0, 3, 0],
                        [0, 3, 0],
                        [0, 3, 3]
                    ], [
                        [0, 0, 0],
                        [3, 3, 3],
                        [3, 0, 0]
                    ], [
                        [3, 3, 0],
                        [0, 3, 0],
                        [0, 3, 0]
                    ], [
                        [0, 0, 3],
                        [3, 3, 3],
                        [0, 0, 0]
                    ]
                ]},
                {O: [
                    [4, 4],
                    [4, 4]
                ]},
                {S: [[
                        [0, 0, 0],
                        [0, 5, 5],
                        [5, 5, 0]
                    ], [
                        [5, 0, 0],
                        [5, 5, 0],
                        [0, 5, 0]
                    ], [
                        [0, 5, 5],
                        [5, 5, 0],
                        [0, 0, 0]
                    ], [
                        [0, 5, 0],
                        [0, 5, 5],
                        [0, 0, 5]
                    ]
                ]},
                {T: [[
                        [0, 0, 0],
                        [6, 6, 6],
                        [0, 6, 0]
                    ], [
                        [0, 6, 0],
                        [6, 6, 0],
                        [0, 6, 0]
                    ], [
                        [0, 6, 0],
                        [6, 6, 6],
                        [0, 0, 0]
                    ], [
                        [0, 6, 0],
                        [0, 6, 6],
                        [0, 6, 0]
                    ]
                ]},
                {Z: [[
                        [0, 0, 0],
                        [7, 7, 0],
                        [0, 7, 7]
                    ], [
                        [0, 7, 0],
                        [7, 7, 0],
                        [7, 0, 0]
                    ], [
                        [7, 7, 0],
                        [0, 7, 7],
                        [0, 0, 0]
                    ], [
                        [0, 0, 7],
                        [0, 7, 7],
                        [0, 7, 0]
                    ]
                ]}
            ]
            s.gameStart = true;
            s.map[s.x][s.y] = s.block;
            s.map[s.x + 1][s.y] = s.block;
            if (s.block == 1) s.map[s.x + 2][s.y] = s.block;
            if (s.block == 1 || s.block == 2 || s.block == 3) s.map[s.x - 1][s.y] = s.block;
            if (s.block == 2 || s.block == 5) s.map[s.x + 1][s.y - 1] = s.block;
            if (s.block == 3 || s.block == 4 || s.block == 7) s.map[s.x + 1][s.y + 1] = s.block;
            if (s.block == 6 || s.block == 7) s.map[s.x][s.y - 1] = s.block;
            if (s.block == 4 || s.block == 5 || s.block == 6) s.map[s.x][s.y + 1] = s.block;
        },
        moveUp(s) {
            let canMove = true;
            let count = 0;
            const mapCopy = JSON.parse(JSON.stringify(s.map));
            for (let i = s.y - 2; i <= s.y + 1; i++) if (mapCopy[0][i] == s.block) canMove = false;
            for (let i = 1; (i < s.map.length) && canMove; i++)
            {
                for (let j = s.y - 2; j <= s.y + 1; j++)
                {
                    if (mapCopy[i][j] == s.block && mapCopy[i - 1][j] == 0)
                    {
                        mapCopy[i - 1][j] = mapCopy[i][j];
                        mapCopy[i][j] = 0;
                        count++;
                    }
                }
            }
            if (canMove && count == 4)
            {
                s.map = mapCopy;
                s.x--;
            }
        },
        moveDown(s) {
            let canMove = true;
            let count = 0;
            const mapCopy = JSON.parse(JSON.stringify(s.map));
            for (let i = s.y - 2; i <= s.y + 1; i++) if (mapCopy[s.map.length - 1][i] == s.block) canMove = false;
            for (let i = s.map.length - 2; (i >= 0) && canMove; i--)
            {
                for (let j = s.y - 2; j <= s.y + 1; j++)
                {
                    if (mapCopy[i][j] == s.block && mapCopy[i + 1][j] == 0)
                    {
                        mapCopy[i + 1][j] = mapCopy[i][j];
                        mapCopy[i][j] = 0;
                        count++;
                    }
                }
            }
            if (canMove && count == 4)
            {
                s.map = mapCopy;
                s.x++;
            }
        },
        rotate(s) {
            if (s.x != 0 && s.x != s.map.length - 1 && s.y != 0 && s.y != s.map[s.x].length - 1)
            {
                if (s.block == 1)
                {
                    if (s.x != s.map.length - 2 && s.y != 1)
                    {
                        if (s.map[s.x][s.y + 1] == 0 && s.map[s.x][s.y - 1] == 0 && s.map[s.x][s.y - 2] == 0)
                        {
                            s.map[s.x - 1][s.y] = 0;
                            s.map[s.x + 1][s.y] = 0;
                            s.map[s.x + 2][s.y] = 0;
                            s.map[s.x][s.y + 1] = s.block;
                            s.map[s.x][s.y - 1] = s.block;
                            s.map[s.x][s.y - 2] = s.block;
                        }
                        else if (s.map[s.x - 1][s.y] == 0 && s.map[s.x + 1][s.y] == 0 && s.map[s.x + 2][s.y] == 0)
                        {
                            s.map[s.x][s.y + 1] = 0;
                            s.map[s.x][s.y - 1] = 0;
                            s.map[s.x][s.y - 2] = 0;
                            s.map[s.x - 1][s.y] = s.block;
                            s.map[s.x + 1][s.y] = s.block;
                            s.map[s.x + 2][s.y] = s.block;
                        }
                    }
                }
                else if (s.block != 4)
                {
                    const rotateContainer = [
                        [s.map[s.x + 1][s.y - 1], s.map[s.x][s.y - 1], s.map[s.x - 1][s.y - 1]],
                        [s.map[s.x + 1][s.y], s.map[s.x][s.y], s.map[s.x - 1][s.y]],
                        [s.map[s.x + 1][s.y + 1], s.map[s.x][s.y + 1], s.map[s.x - 1][s.y + 1]]
                    ];
                    let collision = false;
                    for (let i = -1; i <= 1; i++)
                    {
                        for (let j = -1; j <= 1; j++)
                        {
                            if (s.map[s.x + i][s.y + j] != 0 && s.map[s.x + i][s.y + j] != s.block && rotateContainer[i + 1][j + 1] == s.block) collision = true;
                        }
                    }
                    if (!collision)
                    {
                        for (let i = -1; i <= 1; i++)
                        {
                            for (let j = -1; j <= 1; j++)
                            {
                                if (s.map[s.x + i][s.y + j] == s.block) s.map[s.x + i][s.y + j] = 0;
                                if (rotateContainer[i + 1][j + 1] == s.block) s.map[s.x + i][s.y + j] = rotateContainer[i + 1][j + 1];
                            }
                        }
                    }
                }
            }
        },
        fastFall(state) {
            state.skip = 0;
        },
        toggleLeaderboard(state) {
            state.leaderboardVisible = !state.leaderboardVisible;
        },
        resetGame: () => initialState
    }
});

export const { update, moveUp, moveDown, rotate, fastFall, toggleLeaderboard, resetGame } = GameSlice.actions;

export default GameSlice.reducer;