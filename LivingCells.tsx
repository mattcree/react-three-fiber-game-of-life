import React from 'react'
import {Cell} from './alternate-game'
import LivingCell from './LivingCell'
import {RootState} from './store'
import {connect, MapStateToProps} from 'react-redux'
import {Set} from 'immutable'

interface StateProps {
  living: Set<Cell>
}

const LivingCells: React.FC<StateProps> = ({living}) => {
  return <React.Fragment>
    {living.map(cell => <LivingCell key={"x: " + cell.x + ", y: " + cell.y} x={cell.x} y={cell.y} />)}
  </React.Fragment>
}

const mapState: MapStateToProps<StateProps, {}, RootState> = state => ({
  living: state.main.cells.filter(it => it.alive).toSet()
})

export default connect(mapState)(LivingCells);