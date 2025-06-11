import { createSlice } from '@reduxjs/toolkit';

const savedUser = JSON.parse(localStorage.getItem('userInfo') || 'null');

export const userSlice = createSlice({
    name: 'User',
    initialState: {
        user: savedUser,
        listFavorites: []
    },
    reducers: {
        setUser: (state, action) => {
            if (action.payload === null) {
                localStorage.removeItem('actkn');
                localStorage.removeItem('userInfo');
                state.listFavorites = [];
            } else {
                if (action.payload.token) {
                    localStorage.setItem('actkn', action.payload.token);
                    localStorage.setItem('userInfo', JSON.stringify(action.payload));
                }
            }

            state.user = action.payload;
        },
        setListFavorites: (state, action) => {
            state.listFavorites = action.payload;
        },
        removeFavorite: (state, action) => {
            // Có thể là string hoặc object
            const removeId = typeof action.payload === "object"
                ? action.payload.mediaId
                : action.payload;
        
            state.listFavorites = state.listFavorites.filter(
                (e) => e.mediaId.toString() !== removeId.toString()
            );
        },
        addFavorite: (state, action) => {
            state.listFavorites = [action.payload, ...state.listFavorites];
        }
    },
});

export const {
    setUser,
    setListFavorites,
    removeFavorite,
    addFavorite
} = userSlice.actions;

export default userSlice.reducer;