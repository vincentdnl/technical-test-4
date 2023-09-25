const environment = getEnvironment();

let apiURL = "";
if (environment === "development") apiURL = "http://localhost:8080";

function getEnvironment() {
  if (window.location.href.indexOf("app-staging") !== -1) return "staging";
  if (window.location.href.indexOf("localhost") !== -1 || window.location.href.indexOf("127.0.0.1") !== -1) return "development";
  return "production";
}

export { apiURL, environment };
