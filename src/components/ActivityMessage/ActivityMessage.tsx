import "./ActivityMessage.scss";

export default function ActivityMessage({ message }: { message: string }) {
  return (
    <div className="activity-message" aria-live="polite" aria-atomic="true">
      <p className="activity-message__text">{message}</p>
    </div>
  );
}
