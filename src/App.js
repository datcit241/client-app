import {QueryClient, QueryClientProvider} from "react-query";
import {Provider} from "react-redux";
import {PersistGate} from 'redux-persist/integration/react'
import {persistStore} from "redux-persist";
import {store} from "./stores/store";
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import {StyledChart} from './components/chart';

// ----------------------------------------------------------------------

const persistor = persistStore(store)
export default function App() {
    return (
        <ThemeProvider>
            <QueryClientProvider client={new QueryClient()}>
                <Provider store={store}>
                    <PersistGate persistor={persistor}>
                        <ScrollToTop/>
                        <StyledChart/>
                        <Router/>
                    </PersistGate>
                </Provider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
