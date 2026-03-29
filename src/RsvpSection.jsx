import { useState, useEffect, useCallback } from "react";
import { T } from "./strings";
import { RsvpConfirmation } from "./RsvpConfirmation.jsx";

function buildPayload({
  nombrePrincipal,
  acompanantes,
  ninosNombres,
  ninosEdades,
  asistencia,
  mensaje,
  honeypot,
}) {
  if (honeypot) return null;
  return {
    nombrePrincipal: nombrePrincipal.trim(),
    acompanantes: asistencia === "si" ? acompanantes.trim() : "",
    ninosNombres: asistencia === "si" ? ninosNombres.trim() : "",
    ninosEdades: asistencia === "si" ? ninosEdades.trim() : "",
    asistencia,
    mensaje: mensaje.trim(),
    website: "",
  };
}

export function RsvpSection({ onPhaseChange }) {
  const [phase, setPhase] = useState("form");
  const [submitting, setSubmitting] = useState(false);
  const [nombrePrincipal, setNombrePrincipal] = useState("");
  const [acompanantes, setAcompanantes] = useState("");
  const [ninosNombres, setNinosNombres] = useState("");
  const [ninosEdades, setNinosEdades] = useState("");
  const [asistencia, setAsistencia] = useState("si");
  const [mensaje, setMensaje] = useState("");
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  const submit = async (e) => {
    e.preventDefault();
    if (honeypot) return;
    if (!nombrePrincipal.trim()) return;

    const payload = buildPayload({
      nombrePrincipal,
      acompanantes,
      ninosNombres,
      ninosEdades,
      asistencia,
      mensaje,
      honeypot,
    });
    if (!payload) return;

    setSubmitting(true);
    try {
      const base = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${base}/api/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let data = {};
      const raw = await res.text();
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }
      if (!res.ok) {
        alert(
          data.error ||
            (res.status >= 500
              ? `Error del servidor (${res.status}). ¿Está el API en marcha en el puerto 3001?`
              : `Error ${res.status}. ${raw.slice(0, 200)}`)
        );
        return;
      }
      if (asistencia === "no") {
        setPhase("declined");
      } else {
        setPhase("video");
        setTimeout(() => {
          document.getElementById("rsvp-confirmation")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    } catch (err) {
      console.error(err);
      alert(T.rsvpErrorNoApi);
    } finally {
      setSubmitting(false);
    }
  };

  const goThanks = useCallback(() => setPhase("thanks"), []);

  if (phase === "declined") {
    return (
      <section id="rsvp" className="section-padding reveal is-visible">
        <div className="max-w-lg mx-auto text-center py-12 px-4">
          <h2 className="font-display text-4xl md:text-6xl text-sage-dark mb-6">{T.confirmThankYou}</h2>
          <p className="font-body text-lg leading-relaxed" style={{ color: "rgba(80,60,40,0.82)" }}>
            {T.confirmCantMake}
          </p>
          <p className="font-display text-2xl mt-8" style={{ color: "rgba(80,60,40,0.62)" }}>
            — Andrea &amp; Jorge
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {phase === "form" && (
        <section id="rsvp" className="section-padding reveal is-visible">
          <div id="rsvp-form-block">
            <div className="rsvp-head">
              <h2>{T.rsvpTitle}</h2>
              <p>{T.rsvpSubtitle}</p>
            </div>
            <div className="rsvp-form-wrap">
              <form onSubmit={submit}>
                <div className="hp" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input type="text" id="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </div>

                <div className="form-group">
                  <label htmlFor="rsvp-principal">{T.rsvpPrincipal}</label>
                  <input
                    type="text"
                    id="rsvp-principal"
                    required
                    autoComplete="name"
                    value={nombrePrincipal}
                    onChange={(e) => setNombrePrincipal(e.target.value)}
                    placeholder={T.rsvpNamePh}
                  />
                </div>

                {asistencia === "si" && (
                  <>
                    <div className="form-group">
                      <label htmlFor="rsvp-companion">{T.rsvpCompanion}</label>
                      <input
                        type="text"
                        id="rsvp-companion"
                        value={acompanantes}
                        onChange={(e) => setAcompanantes(e.target.value)}
                        placeholder={T.rsvpNamePh}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="rsvp-children">{T.rsvpChildrenNames}</label>
                      <input
                        type="text"
                        id="rsvp-children"
                        value={ninosNombres}
                        onChange={(e) => setNinosNombres(e.target.value)}
                        placeholder={T.rsvpNamePh}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="rsvp-ages">{T.rsvpChildrenAges}</label>
                      <input
                        type="text"
                        id="rsvp-ages"
                        value={ninosEdades}
                        onChange={(e) => setNinosEdades(e.target.value)}
                        placeholder={T.rsvpChildrenAgesPh}
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label htmlFor="rsvp-asistencia">{T.rsvpAttendance}</label>
                  <select id="rsvp-asistencia" className="rsvp-select" value={asistencia} onChange={(e) => setAsistencia(e.target.value)} required>
                    <option value="si">{T.rsvpAttendYes}</option>
                    <option value="no">{T.rsvpAttendNo}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">{T.rsvpMessage}</label>
                  <textarea id="message" rows={4} value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder={T.rsvpMessagePh} />
                </div>

                <button type="submit" className="btn-submit" disabled={submitting}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2 11 13" />
                    <path d="M22 2 15 22 11 13 2 9 22 2z" />
                  </svg>
                  {submitting ? T.rsvpSending : T.rsvpSendConfirm}
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {(phase === "video" || phase === "thanks") && (
        <section id="rsvp-confirmation" aria-live="polite">
          <RsvpConfirmation phase={phase} onVideoEnded={goThanks} onSkipVideo={goThanks} />
        </section>
      )}
    </>
  );
}
