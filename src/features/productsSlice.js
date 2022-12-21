import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import agent from "../api/agent";

const initialState = {
    products: [],
    isLoading: false,
    hasError: false,
}

export const list = createAsyncThunk('products/list',
    async () => {
        return agent.Products.list();
    }
)

const productsSlice = createSlice({
        name: 'products',
        initialState,
        extraReducers: {
            [list.pending]: (state) => {
                state.isLoading = true;
                state.hasError = false;
            },
            [list.fulfilled]: (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
                console.log('success')
            },
            [list.rejected]: (state) => {
                state.isLoading = false;
                state.hasError = true;
                console.log('error')
            }
        }
    }
)

export default productsSlice.reducer;