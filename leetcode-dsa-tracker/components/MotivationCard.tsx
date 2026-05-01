"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MOTIVATION_QUOTES,
  progressHint,
  quoteIndexForDate,
} from "@/lib/motivation-quotes";

type Props = {
  done: number;
  total: number;
  /** Narrow right-column layout for dashboard */
  variant?: "default" | "aside";
};

export function MotivationCard({ done, total, variant = "default" }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  const { entry, hint } = useMemo(() => {
    const day = new Date().toISOString().slice(0, 10);
    const idx = quoteIndexForDate(day);
    return {
      entry: MOTIVATION_QUOTES[idx],
      hint: progressHint(done, total),
    };
  }, [done, total]);

  useEffect(() => {
    setImgFailed(false);
  }, [entry.imageUrl]);

  const sectionClass =
    variant === "aside"
      ? "motivation-card motivation-card--aside"
      : "motivation-card";

  return (
    <section className={sectionClass} aria-labelledby="motivation-heading">
      <div className="motivation-card__top">
        <span className="motivation-card__icon" aria-hidden>
          ✦
        </span>
        <h2 id="motivation-heading" className="motivation-card__title">
          Daily quote
        </h2>
      </div>

      <div className="motivation-card__body">
        <figure className="motivation-card__figure">
          <div className="motivation-card__visual">
            {imgFailed ? (
              <div className="motivation-card__img-fallback" aria-hidden>
                <span className="motivation-card__img-fallback-icon">◇</span>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- remote Unsplash URLs; native img avoids optimizer/layout issues with fill
              <img
                src={entry.imageUrl}
                alt={entry.imageAlt}
                className="motivation-card__img"
                loading="lazy"
                decoding="async"
                onError={() => setImgFailed(true)}
              />
            )}
          </div>
          <figcaption className="motivation-card__credit">
            Photo via{" "}
            <a
              href="https://unsplash.com?utm_source=leetcode-dsa-tracker&utm_medium=referral"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
          </figcaption>
        </figure>

        <div className="motivation-card__copy">
          <blockquote className="motivation-card__quote">
            <p>&ldquo;{entry.quote}&rdquo;</p>
          </blockquote>
          <cite className="motivation-card__author">— {entry.author}</cite>

          <div className="motivation-card__hint">
            <div className="motivation-card__hint-label">Your momentum</div>
            <p className="motivation-card__hint-text">{hint}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
