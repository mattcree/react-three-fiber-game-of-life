import {render} from 'react-dom';
import React from 'react'
import App from "./App"
import {store, evolve} from './store'

store.dispatch(evolve())

render(<App/>, document.getElementById('root'));
