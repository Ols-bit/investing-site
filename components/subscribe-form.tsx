"use client";

import { useId, useState, type FormEvent } from "react";

type SubscribeStatus =
  | { type: "idle" | "submitting" | "success" }
  | { type: "error"; message: string };

type SubscribeFormProps = {
  variant?: "homepage" | "footer";
};

type SubscribeResponse = {
  status?: string;
  error?: string;
};

const invalidEmailMessage = "Please enter a valid email address.";
const genericErrorMessage = "Something went wrong. Please try again.";

export function SubscribeForm({ variant = "homepage" }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>({ type: "idle" });
  const inputId = useId();
  const feedbackId = useId();
  const isFooter = variant === "footer";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatus({ type: "error", message: invalidEmailMessage });
      return;
    }

    setStatus({ type: "submitting" });

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, website: honeypot }),
      });
      const payload: SubscribeResponse = await response.json();

      if (payload.status === "already_subscribed") {
        setStatus({
          type: "error",
          message: "This email is already subscribed.",
        });
      } else if (response.ok && payload.status === "subscribed") {
        setStatus({ type: "success" });
      } else if (payload.error === "invalid_email") {
        setStatus({ type: "error", message: invalidEmailMessage });
      } else {
        setStatus({ type: "error", message: genericErrorMessage });
      }
    } catch {
      setStatus({ type: "error", message: genericErrorMessage });
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit} noValidate>
      <label
        htmlFor={inputId}
        className={`text-sm font-bold ${isFooter ? "text-white" : "text-slate-950"}`}
      >
        Email address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status.type === "error") {
              setStatus({ type: "idle" });
            }
          }}
          aria-describedby={feedbackId}
          aria-invalid={status.type === "error" && status.message === invalidEmailMessage}
          placeholder="you@example.com"
          disabled={status.type === "submitting" || status.type === "success"}
          className="min-h-12 min-w-0 flex-1 border-2 border-slate-950 bg-slate-50 px-4 text-slate-950 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 disabled:opacity-70"
        />
        <button
          type="submit"
          disabled={status.type === "submitting" || status.type === "success"}
          className={`min-h-12 px-5 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 disabled:cursor-not-allowed disabled:opacity-70 ${
            isFooter
              ? "bg-teal-300 text-slate-950"
              : "bg-slate-950 text-white"
          }`}
        >
          {status.type === "submitting" ? "Submitting…" : "Subscribe"}
        </button>
      </div>
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      />
      <p
        id={feedbackId}
        aria-live={status.type === "error" ? "assertive" : "polite"}
        role={status.type === "error" ? "alert" : "status"}
        className={`text-sm font-semibold ${
          isFooter ? "text-teal-300" : "text-slate-950"
        }`}
      >
        {status.type === "success"
          ? "You're in. Check back for the weekly email."
          : status.type === "error"
            ? status.message
            : status.type === "submitting"
              ? "Submitting your signup…"
              : ""}
      </p>
      <p className={`text-xs leading-5 ${isFooter ? "text-slate-200" : "text-slate-800"}`}>
        Weekly investing tips. Unsubscribe any time. We never share your email.
      </p>
    </form>
  );
}
