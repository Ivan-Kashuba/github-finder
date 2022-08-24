import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface GithubState {
    favourites: string[]
}

const initialState: GithubState = {
    favourites: JSON.parse(localStorage.getItem('favourites') ?? '[]')
}

export const githubSlice = createSlice({
    name: 'github',
    initialState,
    reducers: {
        addFavourites(state, action: PayloadAction<string>) {
            state.favourites.push(action.payload);
            localStorage.setItem('favourites', JSON.stringify(state.favourites))
        },

        removeFavourites(state, action: PayloadAction<string>) {
            state.favourites = state.favourites.filter(f => f !== action.payload);
            localStorage.setItem('favourites', JSON.stringify(state.favourites))
        },
    }
})

export const githubAction = githubSlice.actions;
export const githubReducer = githubSlice.reducer;
