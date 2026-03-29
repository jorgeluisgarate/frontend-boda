import { useState, useEffect, useRef } from "react";
import { T } from "./strings";
import { assetUrl } from "./assetUrl.js";
import { galleryA } from "./data.js";
import { calcCountdownParts, countdownUntilLabel, formatWeddingDateShort } from "./utils.js";
import { useReveal } from "./useReveal.js";
import { HERO_VIDEO_PATH, HERO_VIDEO_POSTER_PATH } from "./assetConstants.js";

function Countdown() {
  const [parts, setParts] = useState(() => calcCountdownParts());
  useEffect(() => {
    const id = setInterval(() => setParts(calcCountdownParts()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="countdown-grid">
      <div className="countdown-item">
        <span className="num">{String(parts.days).padStart(2, "0")}</span>
        <span className="lbl">{T.countdownDays}</span>
      </div>
      <div className="countdown-sep" aria-hidden />
      <div className="countdown-item">
        <span className="num">{String(parts.hours).padStart(2, "0")}</span>
        <span className="lbl">{T.countdownHours}</span>
      </div>
      <div className="countdown-sep" aria-hidden />
      <div className="countdown-item">
        <span className="num">{String(parts.minutes).padStart(2, "0")}</span>
        <span className="lbl">{T.countdownMinutes}</span>
      </div>
    </div>
  );
}

export function Landing() {
  const revealRef = useReveal();
  const heroVideoRef = useRef(null);
  const giftsVideoRef = useRef(null);
  const heroSrc = assetUrl(HERO_VIDEO_PATH);
  const heroPoster = assetUrl(HERO_VIDEO_POSTER_PATH);

  useEffect(() => {
    heroVideoRef.current?.load();
    giftsVideoRef.current?.load();
  }, []);

  useEffect(() => {
    const abs = new URL(heroSrc, window.location.href).href;
    if ([...document.querySelectorAll('link[rel="preload"]')].some((l) => l.href === abs)) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = heroSrc;
    document.head.appendChild(link);
  }, [heroSrc]);

  return (
    <main ref={revealRef}>
      <section className="hero" id="top">
        <div
          className="hero-video-wrap"
          style={{
            backgroundColor: "#141210",
            backgroundImage: `url(${heroPoster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <video
            ref={heroVideoRef}
            className="hero-bg-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={heroPoster}
            src={heroSrc}
          />
        </div>
        <div className="hero-inner">
          <p className="hero-subtitle reveal">{T.heroSubtitle}</p>
          <h1 className="hero-names reveal">
            <span>Andrea</span>
            <span className="ampersand">&amp;</span>
            <span>Jorge</span>
          </h1>
        </div>
        <div className="hero-spacer" />
        <div className="flex flex-col items-center text-center px-6 pb-2">
          <div className="hero-ornament reveal">
            <span />
            <span aria-hidden="true">✦</span>
            <span />
          </div>
          <p className="hero-date reveal">{formatWeddingDateShort()}</p>
        </div>
        <button
          type="button"
          className="hero-rsvp reveal"
          onClick={() => document.getElementById("welcome")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span>{T.heroRsvp}</span>
          <svg className="chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      </section>

      <section id="welcome" className="section-padding pb-0 bg-ivory">
        <div className="welcome-block reveal">
          <p className="welcome-lead">{T.welcomeLead}</p>
          <h2>{T.welcomeTitle}</h2>
          {T.welcomeParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <div className="marquee-wrap">
          <div className="marquee">
            {[...galleryA, ...galleryA].map((g, i) => (
              <div key={i} className="marquee-cell">
                <img src={g.src} alt="" loading={i < 4 ? "eager" : "lazy"} decoding="async" style={{ objectPosition: g.pos }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="countdown" className="countdown countdown--white">
        <div className="countdown-inner reveal">
          <h2>{T.countdownTitle}</h2>
          <p className="sub">{countdownUntilLabel()}</p>
          <Countdown />
        </div>
      </section>

      <section className="section-padding panel-gold reveal">
        <div className="panel-inner">
          <h2>{T.eventsTitle}</h2>
          <p className="subtitle mb-8">{T.eventsSubtitle}</p>
          <div className="card-white">
            <h3 className="venue-name">{T.venueName}</h3>
            <div className="venue-meta">
              <span className="font-body italic opacity-80">{formatWeddingDateShort()}</span>
              <span className="dot">·</span>
              <span className="font-display text-2xl">19:00 – 00:00</span>
            </div>
            <div className="venue-meta flex-col gap-1">
              <span>{T.venueAddress}</span>
            </div>
            <iframe
              className="map-frame"
              title="Colombia 7664, La Florida, Chile"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3326.1237465831055!2d-70.59381431478153!3d-33.52416813258795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d0f7b2a9ffd7%3A0xf6a3cbcdeac9cbb9!2sColombia%207664%2C%208240590%20La%20Florida%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1774739116237!5m2!1ses!2scl"
            />
            <a
              className="maps-link"
              href="https://www.google.com/maps/search/?api=1&query=Colombia+7664+La+Florida+Chile"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {T.openMaps}
            </a>
          </div>
        </div>
      </section>

      <section className="section-padding program section-has-bg-image">
        <div className="section-bg-image-wrap" aria-hidden>
          <img className="section-bg-image" src={assetUrl("/assets/DMR61604.jpg")} alt="" />
        </div>
        <div className="section-bg-video-scrim" aria-hidden />
        <div className="reveal section-bg-video-inner" style={{ maxWidth: "42rem", margin: "0 auto" }}>
          <h2>{T.programTitle}</h2>
          <p className="program-intro">{T.programIntro}</p>
          <p className="prog-date">{formatWeddingDateShort()}</p>
        </div>
      </section>

      <section className="overlay-section overlay-section--dress reveal">
        <div className="overlay-content overlay-content--dress">
          <div className="dress-grid-container">
            <div className="dress-photo-col">
              <img className="dress-photo" src={assetUrl("/assets/gallery-1.jpg")} alt="" loading="lazy" />
            </div>
            <div className="glass-card glass-card--dress-col">
              <h2>{T.dressTitle}</h2>
              <p className="desc dress-body">{T.dressBody}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="overlay-section reveal">
        <video
          ref={giftsVideoRef}
          className="overlay-bg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroPoster}
          src={heroSrc}
        />
        <div className="overlay-content">
          <div className="gifts-card">
            <h2 className="font-display text-4xl md:text-7xl text-sage-dark mb-6">{T.giftsTitle}</h2>
            <p className="lead">{T.giftsText}</p>
            <h3 className="gifts-transfer-heading font-body text-sm uppercase tracking-widest text-sage-dark mt-8 mb-4">
              {T.giftsTransferHeading}
            </h3>
            <div className="bank-box">
              <h4>{T.giftsAccount1}</h4>
              <p className="details">{T.giftsAccount1Details}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
