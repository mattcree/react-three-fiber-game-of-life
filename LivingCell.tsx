import React, {useRef} from 'react'

interface CellProps {
  x: number,
  y: number
}

const LivingCell: React.FC<CellProps> = ({x, y}) => {
  const mesh = useRef()
  return <mesh position={[x, y, 0]} ref={mesh} scale={[1, 1, 1]}>
    <boxBufferGeometry attach="geometry" args={[1, 1, 0]} />
    <meshStandardMaterial attach="material" color={'blue'} />
  </mesh>
}

export default LivingCell;
