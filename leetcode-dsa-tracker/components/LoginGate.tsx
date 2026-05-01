"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";

export function LoginGate() {
  const { authReady, signInWithEmail, showToast, prepBrand } = useApp();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  if (!authReady) {
    return (
      <div className="login-gate">
        <div className="login-gate__card login-gate__card--narrow">
          <p className="login-gate__loading">Checking session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-gate">
      <div className="login-gate__card">
        <div className="login-gate__brand">
          <span className="login-gate__logo">⬡</span>
          <div>
            <h1 className="login-gate__title">{prepBrand.brandHeading}</h1>
            <p className="login-gate__tag">{prepBrand.brandSub}</p>
          </div>
        </div>
        <p className="login-gate__lead">
          Sign in with your email to load your progress from the cloud. We’ll
          send you a one-time link — no password.
        </p>
        <label className="login-gate__label" htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-gate__input"
        />
        <button
          type="button"
          className="login-gate__submit"
          disabled={sending}
          onClick={() => {
            setSending(true);
            void signInWithEmail(email).then((r) => {
              setSending(false);
              if (r.error) showToast(r.error);
              else {
                showToast("Check your email for the sign-in link.");
                setEmail("");
              }
            });
          }}
        >
          {sending ? "Sending…" : "Continue with email"}
        </button>
      </div>
    </div>
  );
}
