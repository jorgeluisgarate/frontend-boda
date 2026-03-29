import { useState, useCallback } from "react";
import { assetUrl } from "./assetUrl.js";
import { T } from "./strings";

export function Intro({ onEntered, onStartMusic }) {
  const [playing, setPlaying] = useState(false);
  const [hidden, setHidden] = useState(false);

  const finish = useCallback(() => {
    setHidden(true);
    setTimeout(() => {
      onEntered?.();
    }, 800);
  }, [onEntered]);

  const handleEnter = useCallback(
    (videoEl) => {
      if (playing) return;
      setPlaying(true);
      onStartMusic?.();
      const v = videoEl;
      if (!v) return;
      v.play().catch(() => {});
      let done = false;
      const onEnd = () => {
        if (done) return;
        done = true;
        clearTimeout(forceTimer);
        v.removeEventListener("timeupdate", onNear);
        v.removeEventListener("error", onEnd);
        finish();
      };
      const onNear = () => {
        if (v.duration && v.duration - v.currentTime <= 0.85) onEnd();
      };
      v.addEventListener("timeupdate", onNear);
      v.addEventListener("error", onEnd);
      const forceTimer = setTimeout(onEnd, 45000);
    },
    [playing, onStartMusic, finish]
  );

  return (
    <div
      className={`intro-overlay ${playing ? "is-playing" : ""} ${hidden ? "is-hidden" : ""}`}
      style={hidden ? { display: "none" } : undefined}
      role="button"
      tabIndex={0}
      aria-label="Entrar"
      onClick={(e) => {
        const v = e.currentTarget.querySelector(".intro-video");
        handleEnter(v);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const v = e.currentTarget.querySelector(".intro-video");
          handleEnter(v);
        }
      }}
    >
      <img className="intro-poster" src={assetUrl("/assets/intro-poster-new-BU7qGwfU.jpg")} alt="" />
      <video
        className="intro-video"
        src={assetUrl("/assets/intro-video-new-XmwQeafK.mp4")}
        playsInline
        muted
        preload="auto"
        poster={assetUrl("/assets/intro-poster-new-BU7qGwfU.jpg")}
      />
      <p className="intro-hint">{T.introHint}</p>
    </div>
  );
}
