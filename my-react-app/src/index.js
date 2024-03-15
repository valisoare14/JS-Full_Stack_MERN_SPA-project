import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './store/store'
import { Provider } from 'react-redux';
import './styles/index.css'

//Provider-ul pune la dispozitie store-ul catre aplicatie

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
       <App />
    </Provider>
);


//</React.StrictMode> forteaza randarea componentei App de doua ori pentru
//a facilita gasirea eventualelor probleme(de aia log-urile in console apar de doua ori)

