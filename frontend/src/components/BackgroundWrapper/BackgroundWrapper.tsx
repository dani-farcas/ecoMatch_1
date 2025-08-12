// 📁 src/components/layout/BackgroundWrapper.tsx
import React from "react";
import "./BackgroundWrapper.css";

interface Props {
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<Props> = ({ children }) => {
  return <div className="background-wrapper">{children}</div>;
};

export default BackgroundWrapper;
