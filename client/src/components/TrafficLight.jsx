export default function TrafficLight({ signal = "red", compact = false }) {
  return (
    <div className={`traffic-light ${compact ? "compact" : ""}`}>
      <div className={`bulb red ${signal === "red" ? "on" : ""}`} />
      <div className={`bulb yellow ${signal === "yellow" ? "on" : ""}`} />
      <div className={`bulb green ${signal === "green" ? "on" : ""}`} />
    </div>
  );
}
