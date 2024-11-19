const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

const jar = new CookieJar();
const axiosInstance = wrapper(axios.create({ jar }));

let authToken;

async function login() {
  const url = "http://108.181.195.185:8000/api/method/login";
  const credentials = {
    usr: "Administrator",
    pwd: "deskgoo123",
  };

  try {
    const response = await axiosInstance.post(url, credentials);
    console.log("Login response:", response.data);
    const cookies = response.headers["set-cookie"];
    if (cookies) {
      const sidCookie = cookies.find((cookie) => cookie.startsWith("sid="));
      if (sidCookie) {
        authToken = sidCookie.split(";")[0];
        console.log("Extracted authToken (sid):", authToken);
      }
    }
    return {
      statusCode: response.status,
      authToken,
      message: response.data,
    };
  } catch (error) {
    console.error(
      "Login failed:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Login failed");
  }
}

async function fetchData() {
  const url = "http://202.51.3.168/api/resource/Employee";
  const headers = {
    Cookie: authToken,
  };

  try {
    console.log("Fetching employee data...");
    const response = await axiosInstance.get(url, { headers });
    const employeeList = response.data.data; // Assuming the response format has `data` array
    console.log("Employee list fetched:", employeeList);

    const detailedEmployees = [];
    for (const { name } of employeeList) {
      const detailUrl = `http://202.51.3.168/api/resource/Employee/${name}`;
      const detailResponse = await axiosInstance.get(detailUrl, { headers });
      detailedEmployees.push(detailResponse.data.data); // Assuming detailed data is in `data`
    }
    console.log("Detailed employee data fetched successfully.");

    return detailedEmployees;
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to fetch data");
  }
}

if (require.main === module) {
  (async () => {
    try {
      console.log("Logging in to Frappe...");
      await login();
      const employeeData = await fetchData();
      console.log("Fetched and processed employee data:", employeeData);
    } catch (error) {
      console.error("Error in main process:", error.message);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
    }
  })();
}

module.exports = { login, fetchData };
