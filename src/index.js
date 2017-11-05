import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import './index.css'
import highFidelityReducers from './reducers'
import App from './containers/App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDCkNqPBd9XiSDypMe0EUgIA4e1HB9LIp4",
  databaseURL: "https://high-fidelity-676ee.firebaseio.com",
  authDomain: "high-fidelity-676ee.firebaseapp.com",
  storageBucket: "high-fidelity-676ee.appspot.com"
}

firebase.initializeApp(firebaseConfig)

const store = createStore(highFidelityReducers)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'))

registerServiceWorker()
