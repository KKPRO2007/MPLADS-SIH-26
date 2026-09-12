export default function AshokaChakra({ size = 28, color = "#FFFFFF" }) {
  const spokes = Array.from({ length: 24 });
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="4" />
      <circle cx="50" cy="50" r="6" fill={color} />
      {spokes.map((_, i) => {
        const angle = (i * 360) / spokes.length;
        return (
          <line
            key={i}
            x1="50"
            y1="50"
            x2="50"
            y2="6"
            stroke={color}
            strokeWidth="2.2"
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}
    </svg>
  );
}
