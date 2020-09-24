import React from 'react'
import {Canvas} from 'react-three-fiber'
import {Provider} from 'react-redux'
import {store} from "./store"
import LivingCells from "./LivingCells"

const App: React.FC = () => {
  return <Canvas style={{width: window.innerWidth, height: window.innerHeight}} camera={{position: [0, 0, 100]}}>
    {console.log('canvas redrawing')}
    <Provider store={store}>
      <LivingCells />
    </Provider>
  </Canvas>
}

export default App;