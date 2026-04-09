import "../A2UIRenderer/A2UIRenderer.scss";

interface ProcessingStatusProps {
  text: string;
  percent?: number;
}

export default function ProcessingStatus({
  text,
  percent,
}: ProcessingStatusProps) {
  const progressPercent =
    typeof percent === "number" ? Math.max(0, Math.min(100, percent)) : null;

  return (
    <div className="a2ui-renderer__processing">
      <p className="a2ui-renderer__processing-text">{text}</p>
      {progressPercent !== null && (
        <div className="a2ui-renderer__progress-track">
          <div
            className="a2ui-renderer__progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
