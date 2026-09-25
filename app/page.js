"use client";

import { useEffect, useState } from "react";

const CHANNEL_LINK =
  "https://whatsapp.com/channel/0029VbB2YlEEgGfKyILoN53o";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [refCode, setRefCode] = useState("");
  const [count, setCount] = useState(0);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  const required = 20;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref) {
      fetch("/api/referral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "visit",
          ref,
        }),
      });
    }
  }, []);

  async function register() {
    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/referral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "register",
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      setRefCode(data.refCode);
      setCount(data.count);
      setRegistered(true);
    } catch {
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  const referralLink =
    typeof window !== "undefined" && refCode
      ? `${window.location.origin}/?ref=${refCode}`
      : "";

  async function share() {
    const text =
      "Check out this promotion. Open this link to participate:";

    if (navigator.share) {
      await navigator.share({
        title: "Promotion",
        text,
        url: referralLink,
      });
    } else {
      await navigator.clipboard.writeText(referralLink);
      alert("Referral link copied!");
    }
  }

  return (
    <main className="page">
      <div className="card">
        {!registered ? (
          <>
            <h1>🎁 3GB Data Promotion</h1>

            <p>
              Enter your phone number to participate in the referral
              promotion.
            </p>

            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button onClick={register} disabled={loading}>
              {loading ? "Please wait..." : "Continue"}
            </button>
          </>
        ) : (
          <>
            <h1>🎉 You're Registered</h1>

            <p>
              Share your referral link with friends. Your progress is
              based on verified referral visits.
            </p>

            <div className="progress">
              <div
                className="progressBar"
                style={{
                  width: `${Math.min(
                    (count / required) * 100,
                    100
                  )}%`,
                }}
              />
            </div>

            <h2>
              {count} / {required}
            </h2>

            {count >= required ? (
              <div className="success">
                Referral requirement reached.
              </div>
            ) : (
              <p>
                {required - count} more verified referrals needed.
              </p>
            )}

            <button onClick={share}>
              📤 Share Referral Link
            </button>

            <a
              className="channel"
              href={CHANNEL_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open WhatsApp Channel
            </a>

            <p className="small">
              Referral code: <strong>{refCode}</strong>
            </p>
          </>
        )}
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: #f1f5f9;
          font-family: Arial, sans-serif;
        }

        .card {
          width: 100%;
          max-width: 420px;
          padding: 30px;
          background: white;
          border-radius: 18px;
          text-align: center;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        h1 {
          margin-bottom: 10px;
        }

        input {
          width: 100%;
          padding: 14px;
          margin: 15px 0;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 16px;
        }

        button {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          background: #25d366;
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.6;
        }

        .progress {
          height: 14px;
          margin: 20px 0 10px;
          background: #ddd;
          border-radius: 20px;
          overflow: hidden;
        }

        .progressBar {
          height: 100%;
          background: #25d366;
          transition: width 0.3s;
        }

        .channel {
          display: block;
          margin-top: 15px;
          padding: 14px;
          background: #128c7e;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
        }

        .success {
          margin: 15px 0;
          padding: 12px;
          background: #dcfce7;
          border-radius: 8px;
          color: #166534;
        }

        .small {
          font-size: 13px;
          color: #666;
          margin-top: 20px;
        }
      `}</style>
    </main>
  );
}
