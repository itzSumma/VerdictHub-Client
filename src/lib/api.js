export const api = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export async function authorizedFetch(path, token, options = {}) {
  return fetch(`${api}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

export async function uploadToImgBB(file) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) throw new Error("imgBB API key is missing.");

  const body = new FormData();
  body.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body,
  });
  const data = await response.json();
  if (!response.ok || !data?.data?.url) throw new Error(data?.error?.message || "Image upload failed.");
  return data.data.url;
}
