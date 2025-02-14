import * as React from "react";

const DrekaIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={50} // Adjusted to make it larger
    height={50} // Adjusted to make it larger
    fill="none"
    className="mb-4" // Added margin bottom to space it out
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M2.154 21.552H.794M5.011 12.708l-1.11-.803M12.472 7.255l-.431-1.33M21.678 7.255l.409-1.33M29.116 12.708l1.111-.803M31.973 21.552h1.36M29.116 30.419l1.111.802M21.678 35.872l.409 1.33M12.472 35.872l-.431 1.33M5.011 30.419l-1.11.802"
    />
    <path
      stroke="#fff"
      strokeMiterlimit={10}
      strokeWidth={1.2}
      d="M17.075 31.404c5.385 0 9.75-4.41 9.75-9.852s-4.365-9.853-9.75-9.853-9.75 4.411-9.75 9.853c0 5.441 4.365 9.852 9.75 9.852Z"
    />
  </svg>
);

export default DrekaIcon;
