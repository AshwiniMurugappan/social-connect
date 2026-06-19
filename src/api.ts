const BACKEND_URL = "http://localhost:5000";

// Save a connected platform to the backend
export async function saveConnection(platform: string) {
  const response = await fetch(`${BACKEND_URL}/connections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: "user1",       // hardcoded for now, will be dynamic later
      platform: platform,
      accessToken: "pending" // will be real token after OAuth is set up
    }),
  });
  return response.json();
}

// Get all connected platforms from the backend
export async function getConnections() {
  const response = await fetch(`${BACKEND_URL}/connections?userId=user1`);
  return response.json();
}

// Disconnect a platform
export async function deleteConnection(platform: string) {
  const response = await fetch(`${BACKEND_URL}/connections/${platform}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: "user1" }),
  });
  return response.json();
}