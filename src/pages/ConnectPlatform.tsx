import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const GRADIENT = "linear-gradient(135deg, #FF2D6B 0%, #FF6B35 100%)";

const PLATFORM_INFO: Record<string, {
  name: string; color: string; description: string; permissions: string[];
}> = {
  instagram: {
    name: "Instagram", color: "#E1306C",
    description: "Connect your Instagram account to go live and auto-post content.",
    permissions: ["Post photos and videos", "Go live on Instagram", "View account insights"],
  },
  facebook: {
    name: "Facebook", color: "#1877F2",
    description: "Connect your Facebook Page to publish posts and stream live.",
    permissions: ["Manage your Page posts", "Go live on Facebook", "Access Page analytics"],
  },
  tiktok: {
    name: "TikTok", color: "#000000",
    description: "Connect TikTok to publish short videos and reach your audience.",
    permissions: ["Upload videos to TikTok", "View basic profile info", "Access video insights"],
  },
  youtube: {
    name: "YouTube", color: "#FF0000",
    description: "Connect your YouTube channel to stream live and upload videos.",
    permissions: ["Manage YouTube videos", "Go live on YouTube", "View channel analytics"],
  },
};

export default function ConnectPlatform() {
  const { platform } = useParams<{ platform: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const info = PLATFORM_INFO[platform || ""] || PLATFORM_INFO["instagram"];

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://twin-backend-production-3a12.up.railway.app'}/auth/${platform}`);
      const data = await res.json();

      const popup = window.open(data.url, "oauth", "width=500,height=600,left=400,top=100");

      // Listen for success message from backend
      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === "OAUTH_SUCCESS") {
          window.removeEventListener("message", messageHandler);
          clearInterval(timer);
          navigate(`/success/${platform}`);
        }
        if (event.data.type === "OAUTH_ERROR") {
          window.removeEventListener("message", messageHandler);
          clearInterval(timer);
          setLoading(false);
          alert("Connection failed. Please try again.");
        }
      };

      window.addEventListener("message", messageHandler);

      // Fallback — if popup closes without message
      const timer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(timer);
          window.removeEventListener("message", messageHandler);
          // Check if connected by calling backend
          fetch(`https://twin-backend-production-3a12.up.railway.app/connections?userId=1`)
            .then(r => r.json())
            .then(data => {
              const isConnected = data.connections.some(
                (c: { platform: string }) => c.platform === platform
              );
              if (isConnected) {
                navigate(`/success/${platform}`);
              } else {
                setLoading(false);
              }
            })
            .catch(() => setLoading(false));
        }
      }, 500);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#fff5f7",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <div style={{
        background: "white", borderRadius: "20px",
        padding: "36px", width: "380px",
        boxShadow: "0 8px 40px rgba(255,45,107,0.1)",
      }}>

        {/* Back button */}
        <button onClick={() => navigate("/")} style={{
          background: "none", border: "none",
          color: "#999", fontSize: "13px",
          cursor: "pointer", padding: 0,
          marginBottom: "24px", display: "flex",
          alignItems: "center", gap: "4px",
        }}>
          ← Back
        </button>

        {/* Platform icon */}
        <div style={{
          width: 64, height: 64, borderRadius: "16px",
          background: info.color + "15",
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "32px",
          marginBottom: "20px",
        }}>
          {platform === "instagram" && "📸"}
          {platform === "facebook"  && "👤"}
          {platform === "tiktok"    && "🎵"}
          {platform === "youtube"   && "▶️"}
        </div>

        <h2 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 800, color: "#111" }}>
          Connect {info.name}
        </h2>
        <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#888", lineHeight: 1.6 }}>
          {info.description}
        </p>

        {/* Permissions list */}
        <div style={{
          background: "#fff5f7", borderRadius: "12px",
          padding: "16px", marginBottom: "24px",
        }}>
          <p style={{ margin: "0 0 12px", fontSize: "12px", fontWeight: 600,
            color: "#FF2D6B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Twin will be able to:
          </p>
          {info.permissions.map((perm, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center",
              gap: "8px", marginBottom: "8px",
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                background: "#FF2D6B", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "10px", color: "white", flexShrink: 0,
              }}>✓</div>
              <span style={{ fontSize: "13px", color: "#444" }}>{perm}</span>
            </div>
          ))}
        </div>

        {/* Connect button */}
        <button
          onClick={handleConnect}
          disabled={loading}
          style={{
            width: "100%", padding: "15px",
            borderRadius: "12px", border: "none",
            background: loading ? "#f5f5f5" : GRADIENT,
            color: loading ? "#aaa" : "white",
            fontSize: "15px", fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}>
          {loading ? "Connecting..." : `Connect ${info.name}`}
        </button>

        <p style={{ fontSize: "11px", color: "#bbb", textAlign: "center", marginTop: "12px" }}>
          You can disconnect anytime from Manage Accounts
        </p>
      </div>
    </div>
  );
}