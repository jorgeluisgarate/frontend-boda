import { useState, useCallback, useRef } from "react";
import { assetUrl } from "./assetUrl.js";
import { T } from "./strings";

const INTRO_FADE_MS = 800;

export function Intro({ onEntered, onStartMusic, onPreloadStart, onExitComplete }) {
  const [playing, setPlaying] = useState(false);
  const [hidden, setHidden] = useState(false);
  const exitTimerRef = useRef(null);

  const finish = useCallback(() => {
    /** 1) Mostrar landing debajo (mismo frame, sin hueco blanco). */
    onEntered?.();
    /** 2) Fundido del intro encima; no usar display:none hasta desmontar. */
    setHidden(true);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = window.setTimeout(() => {
      exitTimerRef.current = null;
      onExitComplete?.();
    }, INTRO_FADE_MS + 50);
  }, [onEntered, onExitComplete]);

  const handleEnter = useCallback(
    (videoEl) => {
      if (playing) return;
      onPreloadStart?.();
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
    [playing, onStartMusic, onPreloadStart, finish]
  );

  return (
    <div
      className={`intro-overlay ${playing ? "is-playing" : ""} ${hidden ? "is-hidden" : ""}`}
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
