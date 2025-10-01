import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import foldersReducer from './slices/foldersSlice';
import linksReducer from './slices/linksSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        folders: foldersReducer,
        links: linksReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;