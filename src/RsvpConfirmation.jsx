import { useRef, useEffect } from "react";
import { T } from "./strings";
import { formatWeddingDate, calendarUrl } from "./utils";
import { assetUrl } from "./assetUrl.js";

export function RsvpConfirmation({ phase, onVideoEnded, onSkipVideo }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (phase !== "video" || !videoRef.current) return;
    const v = videoRef.current;
    v.muted = true;
    const p = v.play();
    if (p) p.catch(() => {});
  }, [phase]);

  if (phase === "video") {
    return (
      <div className="confirmation-flow">
        <div className="confirm-video-stage">
          <div className="confirm-video-wrap">
            <video
              ref={videoRef}
              src={assetUrl("/assets/rsvp-confirmation-DYbKwzwP.webm")}
              playsInline
              muted
              onEnded={onVideoEnded}
            />
          </div>
          <button type="button" className="confirm-video-skip" onClick={onSkipVideo}>
            {T.skipVideo}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "thanks") {
    const niceDate = formatWeddingDate();
    const cal = calendarUrl();
    return (
      <div className="confirmation-flow">
        <div className="confirm-thanks-stage">
          <h2 className="font-display">{T.confirmThankResponse}</h2>
          <p className="body-text">{T.confirmExcited}</p>
          <p className="body-text">{T.confirmThankPart}</p>
          <p
            className="fine-print"
            style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.75rem", marginTop: "2rem" }}
          >
            {T.confirmLookForward}
          </p>
          <p className="date-line font-display">{niceDate}</p>
          <a className="btn-calendar" href={cal} target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {T.confirmAddCalendar}
          </a>
          <p className="signoff font-display">— Andrea &amp; Jorge</p>
          <p className="fine-print">{T.confirmPlansChange}</p>
        </div>
      </div>
    );
  }

  return null;
}
