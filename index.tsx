import {render} from 'react-dom';
import React from 'react'
import App from "./App"
import {store, evolve} from './store'

setInterval(() => {
  console.log("Running evolution")
  store.dispatch(evolve())
}, 1000)

render(<App/>, document.getElementById('root'));
