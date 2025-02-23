import React from "react";
import { RotatingLines } from "react-loader-spinner";

export const Loader = ({ scale = 1 }) => {
  return (
    <RotatingLines
      strokeColor="grey"
      strokeWidth="5"
      animationDuration="0.75"
      width={(50 * scale).toString()}
      visible={true}
    />
  );
};
