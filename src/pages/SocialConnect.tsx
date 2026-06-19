import { useNavigate } from "react-router-dom";
import { useEffect }   from "react";
import { useConnectedPlatforms } from "../store";
import { getConnections, deleteConnection } from "../api";

const GRADIENT = "linear-gradient(135deg, #FF2D6B 0%, #FF6B35 100%)";
const PINK     = "#FF2D6B";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", handle: "@yourbrand",   bg: "#fff0f5" },
  { id: "facebook",  name: "Facebook",  handle: "Your Brand",   bg: "#f0f5ff" },
  { id: "tiktok",    name: "TikTok",    handle: "@yourbrand",   bg: "#f5f5f5" },
  { id: "youtube",   name: "YouTube",   handle: "Your Channel", bg: "#fff0f0" },
];

export default function SocialConnect() {
  const navigate                          = useNavigate();
  const { connected, markConnected, markDisconnected } = useConnectedPlatforms();

  // Load connections from backend when page opens
  useEffect(() => {
    getConnections()
      .then(data => {
        data.connections.forEach((c: { platform: string }) => {
          markConnected(c.platform);
        });
      })
      .catch(err => console.error("Could not load connections:", err));
  }, []);

  const handleDisconnect = async (platformId: string) => {
    try {
      await deleteConnection(platformId);
      markDisconnected(platformId);
    } catch (err) {
      console.error("Could not disconnect:", err);
      markDisconnected(platformId); // still update UI
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
        padding: "32px", width: "360px",
        boxShadow: "0 8px 40px rgba(255,45,107,0.1)",
      }}>

        <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: 800, color: "#111" }}>
          Connect Social Accounts
        </h2>
        <p style={{ margin: "0 0 24px", fontSize: "13px", color: "#999" }}>
          Auto-post & go live across platforms
        </p>

        {PLATFORMS.map(p => (
          <div key={p.id} style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 0",
            borderBottom: "1px solid #fafafa",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "10px",
                background: p.bg, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "20px",
              }}>
                {p.id === "instagram" && "📸"}
                {p.id === "facebook"  && "👤"}
                {p.id === "tiktok"    && "🎵"}
                {p.id === "youtube"   && "▶️"}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>{p.name}</div>
                <div style={{ fontSize: "12px", color: "#bbb" }}>{p.handle}</div>
              </div>
            </div>

            {connected[p.id] ? (
              <button
                onClick={() => handleDisconnect(p.id)}
                style={{
                  background: "#f0fdf4", color: "#16a34a",
                  border: "1px solid #bbf7d0", borderRadius: "8px",
                  padding: "6px 12px", fontSize: "12px",
                  fontWeight: 600, cursor: "pointer",
                }}>
                ✓ Connected
              </button>
            ) : (
              <button
                onClick={() => navigate(`/connect/${p.id}`)}
                style={{
                  background: "transparent", color: PINK,
                  border: `1.5px solid ${PINK}`, borderRadius: "8px",
                  padding: "6px 14px", fontSize: "12px",
                  fontWeight: 600, cursor: "pointer",
                }}>
                Connect
              </button>
            )}
          </div>
        ))}

        <button style={{
          width: "100%", marginTop: "20px",
          padding: "14px", borderRadius: "12px",
          border: "none", background: GRADIENT,
          color: "white", fontSize: "14px",
          fontWeight: 700, cursor: "pointer",
        }}>
          Manage Accounts
        </button>
      </div>
    </div>
  );
}