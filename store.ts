import { configureStore, createReducer, createSlice, combineReducers } from '@reduxjs/toolkit'
import { Ecosystem } from './types'
import { nextGeneration, seedEcosystem, emptyEcosystem } from './game'

interface RootState {
  ecosystem: EcosystemState
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
      ecosystem: state === initialState ? seedEcosystem(40, 40) : nextGeneration(state.ecosystem)
    })
  }
})

export const {evolve} = slice.actions

const rootReducer = combineReducers({ecosystem: slice.reducer})

const livingSelector = (state: RootState) => state.ecosystem.ecosystem.living


export const store = configureStore({reducer: rootReducer})