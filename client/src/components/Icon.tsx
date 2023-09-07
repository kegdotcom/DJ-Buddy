import React from "react";

interface IconProps {
  name: string;
}

// easier way to implement bootstrap icons as an embedded React component
export default function Icon({ name }: IconProps) {
  return <i className={`bi bi-${name}`}></i>;
}
