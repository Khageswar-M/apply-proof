import { createRoot } from 'react-dom/client'
import './index.css'
import {store} from '../src/components/redux/store';
import { Provider } from "react-redux";

import App from './App'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
