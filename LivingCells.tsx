import React from 'react'
import {Cell} from './types'
import LivingCell from './LivingCell'
import {RootState} from './store'
import {connect, MapStateToProps} from 'react-redux'

interface StateProps {
  living: Array<Cell>
}

const LivingCells: React.FC<StateProps> = ({living}) => {
  return <React.Fragment>
    {living.map(cell => <LivingCell key={"x: " + cell.x + ", y: " + cell.y} x={cell.x} y={cell.y} />)}
  </React.Fragment>
}

const mapState: MapStateToProps<StateProps, {}, RootState> = state => ({
  living: state.main.ecosystem.living.toArray()
})

export default connect(mapState)(LivingCells);