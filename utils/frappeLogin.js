const axios = require("axios");

async function loginToFrappe() {
  const loginUrl = "http://108.181.195.185:8000/api/method/login";
  const credentials = {
    usr: "Administrator",
    pwd: "Deskgoo123",
  };

  try {
    const response = await axios.post(loginUrl, credentials);

    const cookies = response.headers["set-cookie"];

    return cookies;
  } catch (error) {
    console.error("Error logging in to Frappe:", error);
    throw new Error("Login failed");
  }
}

module.exports = loginToFrappe;
