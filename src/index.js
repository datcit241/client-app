import ReactDOM from 'react-dom/client';
import {unstable_HistoryRouter as HistoryRouter} from 'react-router-dom';
// import {Router} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import {createBrowserHistory} from "history";

//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));
export const history = createBrowserHistory();

root.render(
  <HelmetProvider>
      <HistoryRouter history={history}>
          <App/>
      </HistoryRouter>
  </HelmetProvider>
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
