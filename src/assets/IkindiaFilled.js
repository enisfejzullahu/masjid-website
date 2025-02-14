import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const IkindiaFilled = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={32}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill="#06A85D"
        d="M38.515 16.064c-1.598 0-3.065.46-4.323 1.202-1.336-5.065-6.052-8.8-11.66-8.8-6.183 0-11.266 4.528-11.947 10.386a7.284 7.284 0 0 0-3.406-.844C3.223 18.008 0 21.154 0 25.017 0 28.879 2.96 31.77 6.707 32h31.808c4.507 0 8.175-3.581 8.175-7.98 0-4.4-3.668-7.982-8.175-7.982v.026Z"
      />
      <Path
        stroke="#06A85D"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={0.7}
        d="m37.389.64-.236 1.534M43.965 3.863l-1.127 1.1M47.345 10.232l-1.572.256M46.245 17.343l-1.415-.69M24.97 6.932l1.414.69M30.131 1.816l.734 1.356"
      />
      <Path
        fill="#06A85D"
        d="M41.476 15.527a7.286 7.286 0 0 0-2.803-.537c-1.494 0-2.883.409-4.062 1.15-.812-3.018-2.908-5.55-5.659-6.983"
      />
      <Path
        fill="#06A85D"
        d="M41.476 15.527c.917-1.151 1.441-2.635 1.441-4.22 0-3.863-3.197-6.984-7.153-6.984-3.17 0-5.895 2.02-6.812 4.834"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#06A85D" d="M0 0h48v32H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default IkindiaFilled
