import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import agent from "../api/agent";
import initialPagination from "./config/initialPagination";
import initialPagingParams from "./config/initialPagingParams";
import productMapper, {imgMapper, imgRollMapper} from "./mappers/productMapper";
import imageRoll from "./config/imageRoll";

const initialState = {
    products: [],
    product: {},
    currentImage: 0,
    quantity: 0,
    selectedVariations: [],
    isLoading: false,
    hasError: false,
    pagination: initialPagination,
    pagingParams: initialPagingParams,
}

export const get = createAsyncThunk('products/get',
    async (id, {getState}) => {
        return agent.Products.get(id);
    }
)

export const list = createAsyncThunk('products/list',
    async (arg, {getState}) => {
        const {products: {pagingParams, pagination}} = getState();
        // if (pagingParams.pageNumber <= pagination.totalPages || !pagination.totalPages) {
        console.log('listing')
        const urlParams = new URLSearchParams();
        urlParams.append('pageNumber', pagingParams.pageNumber.toString());
        urlParams.append('pageSize', pagingParams.pageSize.toString())

        if (pagingParams.orderBy && pagingParams.order) {
            urlParams.append('order', pagingParams.order);
            urlParams.append('orderBy', pagingParams.orderBy)
        }

        if (pagingParams.searchString !== undefined && pagingParams.searchString !== null) {
            urlParams.append('searchString', pagingParams.searchString)
        }

        return agent.Products.list(urlParams);
        // }
        //
        // return null;
    }
)

export const listAccum = createAsyncThunk('products/listAccum',
    async (arg, {getState}) => {
        const {products: {pagingParams, pagination}} = getState();
        if (pagingParams.pageNumber <= pagination.totalPages) {
            const urlParams = new URLSearchParams();
            urlParams.append('pageNumber', pagingParams.pageNumber.toString());
            urlParams.append('pageSize', pagingParams.pageSize.toString())

            return agent.Products.list(urlParams);
        }

        return null;
    }
)

export const delAll = createAsyncThunk('products/delAll',
    async (products, {dispatch}) => {
        // await products.forEach(product => {
        //     agent.Products.del(product);
        // });

        await Promise.all(products.map(async (product) => {
            await agent.Products.del(product);
        }));

        return products
    }
)

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setPagingParams: (state, {payload}) => {
            console.log(payload)
            if (payload.pageSize) state.pagingParams.pageSize = payload.pageSize;
            if (payload.pageNumber) state.pagingParams.pageNumber = payload.pageNumber;
            if (payload.order) state.pagingParams.order = payload.order;
            if (payload.orderBy) state.pagingParams.orderBy = payload.orderBy;
            state.pagingParams.searchString = payload.searchString;
        },
        resetProducts: (state) => {
            state.products = [];
        },
        setSelectedVariations: (state, {payload: {variation, variationOption}}) => {
            // console.log(action.payload)
            // console.log(variation, variationOption)
            let filtered = state.selectedVariations.filter(option => !variation.variationOptions.map(opt => opt.id).includes(option.id));
            if (variationOption) {
                filtered = [...filtered, variationOption];
            }
            state.selectedVariations = [...filtered];
        },
        setQuantity(state, {payload}) {
            const {quantity, product} = state;

            const finalQuantity = quantity + payload;
            if (finalQuantity <= product.quantity && finalQuantity >= 0) {
                state.quantity = finalQuantity;
            }
        },
        setCurrentImage(state, {payload}) {
            state.currentImage = payload;
        },
        slideImageRoll(state, {payload}) {
            const {imageRoll, images} = state.product;
            if (imageRoll[0].id + payload >= 0 && imageRoll[imageRoll.length - 1].id + payload < images.length) {
                state.product.imageRoll = imageRoll.map(img => {
                    return {
                        id: img.id + payload,
                        img: images[img.id + payload],
                    }
                });
            }
        }
    },
    extraReducers: ({addCase}) => {
        addCase(list.pending, (state) => {
            state.isLoading = true;
            state.hasError = false;
        });
        addCase(list.fulfilled, (state, {payload}) => {
            console.log('success');
            state.isLoading = false;
            if (payload) {
                console.log(payload.pagination)
                state.products = payload.data.map(productMapper);
                state.pagination = payload.pagination;
            }
        });
        addCase(list.rejected, (state, action) => {
            console.log('error', action);
            state.isLoading = false;
            state.hasError = true;
        });


        addCase(listAccum.pending, (state) => {
            state.isLoading = true;
            state.hasError = false;
        });
        addCase(listAccum.fulfilled, (state, {payload}) => {
            console.log('success');
            console.log(payload)
            state.isLoading = false;
            if (payload) {
                console.log(payload.pagination)
                state.products = [...state.products, ...payload.data.filter(product => !state.products.includes(product))];
                state.pagination = payload.pagination;
            }
        });
        addCase(listAccum.rejected, (state, action) => {
            console.log('error', action);
            state.isLoading = false;
            state.hasError = true;
        });


        addCase(get.pending, (state) => {
            console.log('fetching...')
            state.isLoading = true;
            state.hasError = false;
        });
        addCase(get.fulfilled, (state, {payload}) => {
            console.log(payload)
            console.log('get success', payload.images.map(imgMapper));
            const product = productMapper({...payload});

            state.isLoading = false;
            state.product = product;
            state.selectedVariations = [];
            state.quantity = Math.min(1, state.product.quantity);
            state.product.imageRoll = imgRollMapper(product.images, imageRoll.capacity);
            state.currentImage = 0;
        });
        addCase(get.rejected, (state, action) => {
            console.log('error', action);
            state.isLoading = false;
            state.hasError = true;
        });


        addCase(delAll.pending, (state) => {
            state.isLoading = true;
            state.hasError = false;
        });
        addCase(delAll.fulfilled, (state, {payload}) => {
            console.log('success');
            console.log(payload)
            state.isLoading = false;
            console.log('list after deleting', state.products)
            // const toBeDeleted = action.payload;
            // state.products = state.products.filter(product => !toBeDeleted.includes(product.id));
        });
        addCase(delAll.rejected, (state, action) => {
            console.log('error', action);
            state.isLoading = false;
            state.hasError = true;
        });
    }
    }
)

export default productsSlice.reducer;
export const {
    setPagingParams,
    resetProducts,
    setSelectedVariations,
    setQuantity,
    setCurrentImage,
    slideImageRoll
} = productsSlice.actions