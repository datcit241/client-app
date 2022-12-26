import {Helmet} from 'react-helmet-async';
import {useEffect, useState} from 'react';
// @mui
import {Container, Stack, Typography} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import InfiniteScroll from "react-infinite-scroller";
// components
import {ProductCartWidget, ProductFilterSidebar, ProductList, ProductSort} from '../sections/@dashboard/products';

import {listAccum, resetProducts, setPagingParams} from "../features/productsSlice";
// mock
import Loader from "../components/loader/Loader";
import initialPagingParams from "../features/config/initialPagingParams";

// ----------------------------------------------------------------------

export default function ProductsPage() {
    const [openFilter, setOpenFilter] = useState(false);
    const [isLoadingNext, setIsLoadingNext] = useState(false)

    const {products, isLoading, pagination, pagingParams} = useSelector(store => store.products);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoadingNext(true);
        dispatch(setPagingParams({...initialPagingParams, pageSize: 8}))
        dispatch(resetProducts());
        dispatch(listAccum());
        setIsLoadingNext(false);
    }, []);

    const handleGetNext = () => {
        setIsLoadingNext(true);
        dispatch(setPagingParams({pageNumber: pagination.currentPage + 1, pageSize: pagination.pageSize}))
        dispatch(listAccum());
        setIsLoadingNext(false);
    }

    const hasMore = !isLoadingNext && !isLoading && !!pagination && pagination.currentPage < pagination.totalPages;
    const handleOpenFilter = () => {
        setOpenFilter(true);
    };

    const handleCloseFilter = () => {
        setOpenFilter(false);
    };

    return (
        <>
            <Helmet>
                <title> Dashboard: Products | Minimal UI </title>
            </Helmet>

            <Container>
                <Typography variant="h4" sx={{mb: 5}}>
                    Products
                </Typography>

                <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end"
                       sx={{mb: 5}}>
                    <Stack direction="row" spacing={1} flexShrink={0} sx={{my: 1}}>
                        <ProductFilterSidebar
                            openFilter={openFilter}
                            onOpenFilter={handleOpenFilter}
                            onCloseFilter={handleCloseFilter}
                        />
                        <ProductSort/>
                    </Stack>
                </Stack>

                {isLoading && <Loader/>}
                <InfiniteScroll
                    pageStart={0}
                    hasMore={hasMore}
                    loadMore={handleGetNext}
                    initialLoad={Boolean(false)}
                >
                    <ProductList products={products}/>
                </InfiniteScroll>
                <ProductCartWidget/>
            </Container>
        </>
    )
}
