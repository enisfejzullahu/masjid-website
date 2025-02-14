import * as React from "react"
import Svg, { Path } from "react-native-svg"
const AkshamiFilled = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={35}
    height={35}
    fill="none"
    {...props}
  >
    <Path
      fill="#06A85D"
      stroke="#06A85D"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M33.911 23.899H1.09c0-8.707 7.342-15.786 16.395-15.786 9.054 0 16.396 7.079 16.396 15.786h.031Z"
    />
    <Path
      stroke="#06A85D"
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M33.911 23.899H1.09M4.293 27.219h26.258M7.591 30.539h19.662M10.671 33.828H23.8"
    />
  </Svg>
)
export default AkshamiFilled
