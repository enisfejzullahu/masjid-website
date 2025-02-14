import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const AgimiFilled = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={56}
    height={37}
    fill="none"
    {...props}
  >
    <G
      stroke="#06A85D"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      clipPath="url(#a)"
    >
      <Path
        fill="#06A85D"
        d="M42.743 26.384h-31.89c0-8.174 7.133-14.819 15.93-14.819 8.796 0 15.93 6.645 15.93 14.819h.03Z"
      />
      <Path
        strokeLinecap="round"
        d="M42.743 26.384h-31.89M13.996 29.5h25.483M17.17 32.617h19.135M20.163 35.733h12.756M6.257 26.384H4.353M10.248 15.035l-1.572-1.03M20.616 8.038l-.574-1.706M33.463 8.038l.605-1.706M43.862 15.035l1.541-1.03M47.852 26.384h1.904"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 .481h55.742v36.281H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default AgimiFilled
