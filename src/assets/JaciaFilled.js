import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const JaciaFilled = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={31}
    height={32}
    fill="none"
    {...props}
  >
    <G fill="#06A85D" stroke="#06A85D" strokeMiterlimit={10} clipPath="url(#a)">
      <Path
        strokeWidth={1.2}
        d="M24.034 24.86c-7.982 0-14.46-6.367-14.46-14.212 0-3.098 1.011-5.97 2.747-8.3C5.842 3.769 1.012 9.425 1.012 16.218c0 7.846 6.479 14.212 14.461 14.212 4.83 0 9.11-2.33 11.713-5.912a14.469 14.469 0 0 1-3.152.341Z"
      />
      <Path
        strokeWidth={0.7}
        d="M26.724 12.41c-2.69.739-3.297 1.336-4.05 3.98-.751-2.644-1.359-3.241-4.049-3.98 2.69-.74 3.298-1.336 4.05-3.98.752 2.644 1.359 3.24 4.049 3.98Z"
      />
      <Path
        strokeWidth={0.6}
        d="M29.066 4.85c-1.533.426-1.88.767-2.313 2.273-.434-1.506-.781-1.847-2.314-2.274 1.533-.426 1.88-.767 2.314-2.274.433 1.507.78 1.848 2.313 2.274Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#06A85D" d="M0 .813h30.715v30.612H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default JaciaFilled
