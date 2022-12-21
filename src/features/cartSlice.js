import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        func: (state) => {

        }
    }
})

export default cartSlice.reducer;
export const {func} = cartSlice.actions;