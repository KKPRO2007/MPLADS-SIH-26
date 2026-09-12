import indiaEmblem from "../assets/india-emblem.png";

export default function IndiaEmblem({ size = 36 }) {
  return (
    <img
      src={indiaEmblem}
      alt="State Emblem of India"
      className="object-contain brightness-0 invert"
      style={{ width: size, height: size }}
    />
  );
}
