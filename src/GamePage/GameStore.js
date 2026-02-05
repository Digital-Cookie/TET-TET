import { configureStore } from '@reduxjs/toolkit';
import GameReducer from './GameSlice';

export default configureStore({
    reducer: {
        game: GameReducer,
    },
});