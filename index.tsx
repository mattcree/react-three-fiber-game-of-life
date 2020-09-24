import { render } from 'react-dom';
import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useThree, useFrame } from 'react-three-fiber'
import "./style.css";
import {Ecosystem} from "./types"
import {seedEcosystem, nextGeneration} from "./game"

export default function Cells() {
  const [ecosystem, setEcosystem] = useState<Ecosystem>(seedEcosystem(50, 50))

  useEffect(()=>{
    const interval = setInterval(() => {
      nextGeneration(ecosystem)
      console.log("running interval task for " + interval)
    }, 1000);

    return () => {
      console.log("clearing interval task " + interval)
      return clearInterval(interval)
    }
  }, [])

  return <React.Fragment>
    {ecosystem.living.map(cell => <Cell key={"x: " + cell.x + ", y: " + cell.y} position={[cell.x, cell.y, 0]} />)}
  </React.Fragment>
}

function Cell(props) {
  const mesh = useRef()
  return <mesh {...props} ref={mesh} scale={[1, 1, 1]}>
    <boxBufferGeometry attach="geometry" args={[1, 1, 0]} />
    <meshStandardMaterial attach="material" color={'blue'} />
  </mesh>
}

render(
  <Canvas style={{width: window.innerWidth, height: window.innerHeight}} camera={{position: [0, 0, 100]}}>
    {console.log('canvas redrawing')}
    <Cells />
  </Canvas>, 
  document.getElementById('root')
);
