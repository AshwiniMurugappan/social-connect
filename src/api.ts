const BACKEND_URL = "https://twin-backend-production-3a12.up.railway.app";

export async function saveConnection(platform: string) {
  const response = await fetch(`${BACKEND_URL}/connections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: 1,              // ← must be number, no quotes
      platform: platform,
      accessToken: "pending"
    }),
  });
  return response.json();
}

export async function getConnections() {
  const response = await fetch(`${BACKEND_URL}/connections?userId=1`); // ← must be 1 not "user1"
  return response.json();
}

export async function deleteConnection(platform: string) {
  const response = await fetch(`${BACKEND_URL}/connections/${platform}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: 1 }),  // ← must be number, no quotes
  });
  return response.json();
}