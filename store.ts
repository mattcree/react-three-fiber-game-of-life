import {configureStore, createSlice, combineReducers} from '@reduxjs/toolkit'
import {Ecosystem} from './types'
import {nextGeneration} from './set-game'
import {seedEcosystem, emptyEcosystem} from './set-game'

export interface RootState {
  main: EcosystemState
}

interface EcosystemState {
  ecosystem: Ecosystem
}

const initialState: EcosystemState = {
  ecosystem: emptyEcosystem()
}

const slice = createSlice({
  name: 'ecosystem',
  initialState: initialState,
  reducers: {
    evolve: (state: EcosystemState) => ({
      ecosystem: state.ecosystem.living.isEmpty() ? seedEcosystem(40, 40) : nextGeneration(state.ecosystem)
    })
  }
})

export const {evolve} = slice.actions

const rootReducer = combineReducers({main: slice.reducer})

export const store = configureStore({reducer: rootReducer})