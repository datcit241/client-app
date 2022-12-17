import {QueryClient, QueryClientProvider} from "react-query";
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import {StyledChart} from './components/chart';

// ----------------------------------------------------------------------

export default function App() {
    return (
        <ThemeProvider>
            <QueryClientProvider client={new QueryClient()}>
                <ScrollToTop/>
                <StyledChart/>
                <Router/>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
