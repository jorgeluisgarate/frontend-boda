import { useState, useRef, useCallback } from "react";
import { Intro } from "./Intro.jsx";
import { Landing } from "./Landing.jsx";
import { RsvpSection } from "./RsvpSection.jsx";
import { assetUrl } from "./assetUrl.js";

export function WeddingApp() {
  const [preloadStarted, setPreloadStarted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [confirmPhase, setConfirmPhase] = useState("form");
  const [musicMuted, setMusicMuted] = useState(true);
  const audioRef = useRef(null);

  const startMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.5;
    a.muted = false;
    setMusicMuted(false);
    a.play().catch(() => {});
  }, []);

  const toggleMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMusicMuted(a.muted);
    if (!a.muted && a.paused) a.play().catch(() => {});
  }, []);

  return (
    <>
      {/* Montado desde el inicio: el intro llama a onStartMusic en el mismo gesto del usuario; si el audio solo existía tras "entered", el ref era null y la música no arrancaba. */}
      <audio ref={audioRef} loop preload="auto" muted playsInline>
        <source src={assetUrl("/assets/music.mp3")} type="audio/mpeg" />
      </audio>

      {showIntro && (
        <Intro
          onEntered={() => setEntered(true)}
          onStartMusic={startMusic}
          onPreloadStart={() => setPreloadStarted(true)}
          onExitComplete={() => setShowIntro(false)}
        />
      )}

      {(preloadStarted || entered) && (
        <div className={entered ? undefined : "landing-preload-hidden"}>
          <Landing />
        </div>
      )}

      {entered && (
        <>
          <RsvpSection onPhaseChange={setConfirmPhase} />

          <button
            type="button"
            className={`music-toggle ${confirmPhase === "video" || confirmPhase === "thanks" ? "confirm-z" : ""}`}
            onClick={toggleMusic}
            aria-label={musicMuted ? "Activar música" : "Silenciar música"}
            title="Música"
          >
            {!musicMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 9v10h.01M15 5v4l-6 2" />
                <path d="m17 9-6-2" />
                <path d="m3 3 18 18" />
              </svg>
            )}
          </button>
        </>
      )}
    </>
  );
}
