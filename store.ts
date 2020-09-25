import {configureStore, createSlice, combineReducers} from '@reduxjs/toolkit'
import {Cell, nextGeneration, seedEcosystem, emptyEcosystem} from './alternate-game'
import {Set} from 'immutable'

export interface RootState {
  main: EcosystemState
}

interface EcosystemState {
  cells: Set<Cell>
}

const initialState: EcosystemState = {
  cells: emptyEcosystem()
}

const slice = createSlice({
  name: 'ecosystem',
  initialState: initialState,
  reducers: {
    evolve: (state: EcosystemState) => ({
      cells: state.cells.isEmpty() ? seedEcosystem(40, 40) : nextGeneration(state.cells)
    })
  }
})

export const {evolve} = slice.actions

const rootReducer = combineReducers({main: slice.reducer})

export const store = configureStore({reducer: rootReducer})