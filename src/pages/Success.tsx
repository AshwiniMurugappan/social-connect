import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useConnectedPlatforms } from "../store";
import { saveConnection } from "../api";

const GRADIENT = "linear-gradient(135deg, #FF2D6B 0%, #FF6B35 100%)";

export default function Success() {
  const { platform }              = useParams<{ platform: string }>();
  const navigate                  = useNavigate();
  const { markConnected }         = useConnectedPlatforms();
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState("");

  const name = platform
    ? platform.charAt(0).toUpperCase() + platform.slice(1)
    : "";

  useEffect(() => {
    if (!platform) return;

    // Mark connected in frontend store
    markConnected(platform);

    // Save to backend database
    saveConnection(platform)
      .then(() => setSaved(true))
      .catch(() => setError("Could not save to server, but marked locally."));

  }, [platform]);

  return (
    <div style={{
      minHeight: "100vh", background: "#fff5f7",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <div style={{
        background: "white", borderRadius: "20px",
        padding: "48px 36px", width: "360px",
        boxShadow: "0 8px 40px rgba(255,45,107,0.1)",
        textAlign: "center",
      }}>

        {/* Success icon */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: GRADIENT,
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "36px",
          margin: "0 auto 24px", color: "white",
        }}>✓</div>

        <h2 style={{ margin: "0 0 10px", fontSize: "22px", fontWeight: 800, color: "#111" }}>
          {name} Connected!
        </h2>
        <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#999", lineHeight: 1.6 }}>
          Your {name} account is now linked to Twin.
          You can now go live and auto-post from your dashboard.
        </p>

        {/* Show save status */}
        {saved && (
          <p style={{ fontSize: "12px", color: "#16a34a", marginBottom: "20px" }}>
            ✓ Saved to server successfully
          </p>
        )}
        {error && (
          <p style={{ fontSize: "12px", color: "#f59e0b", marginBottom: "20px" }}>
            ⚠ {error}
          </p>
        )}

        <button onClick={() => navigate("/")} style={{
          width: "100%", padding: "15px",
          borderRadius: "12px", border: "none",
          background: GRADIENT, color: "white",
          fontSize: "15px", fontWeight: 700,
          cursor: "pointer", marginBottom: "12px",
        }}>
          Connect More Accounts
        </button>

        <button onClick={() => navigate("/")} style={{
          width: "100%", padding: "15px",
          borderRadius: "12px", border: "1.5px solid #f0f0f0",
          background: "white", color: "#888",
          fontSize: "15px", fontWeight: 600,
          cursor: "pointer",
        }}>
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}