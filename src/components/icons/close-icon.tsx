interface CloseIconProps {
  color?: string;
}

export default function CloseIcon({color = "#e9edf2"}: CloseIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="8"
      viewBox="0 0 16 16"
    >
      <path
        id="close"
        d="M2.7,64.32A1.334,1.334,0,0,0,.815,66.206l5.723,5.719L.82,77.648a1.334,1.334,0,0,0,1.887,1.887l5.719-5.723,5.723,5.719a1.334,1.334,0,1,0,1.887-1.887l-5.723-5.719L16.03,66.2a1.334,1.334,0,0,0-1.887-1.887L8.425,70.038Z"
        transform="translate(-0.425 -63.925)"
        fill={color}
      />
    </svg>
  );
}
