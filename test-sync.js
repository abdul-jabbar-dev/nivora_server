const token = "dummy_token"; // We don't have a token, so we expect 401
fetch("http://localhost:3005/cart/sync", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
  body: JSON.stringify({ items: [] })
}).then(async r => {
  console.log("Status:", r.status);
  const text = await r.text();
  console.log("Body:", text);
}).catch(console.error);
