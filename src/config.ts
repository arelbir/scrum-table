import Cookies from "js-cookie";

const serverURL = Cookies.get("aksa__server-url");
const websocketURL = Cookies.get("aksa__websocket-url");

let httpProtocol = "https:";
let websocketProtocol = "wss:";

if (window.location.protocol === "http:") {
  httpProtocol = "http:";
  websocketProtocol = "ws:";
}

export const SERVER_HTTP_URL = serverURL || process.env.REACT_APP_SERVER_HTTP_URL || `${window.location.origin.replace(window.location.protocol, httpProtocol)}/api`;
export const SERVER_WEBSOCKET_URL =
  websocketURL || process.env.REACT_APP_SERVER_WEBSOCKET_URL || `${window.location.origin.replace(window.location.protocol, websocketProtocol)}/api`;
export const SERVER_WEBSOCKET_PROTOCOL = websocketProtocol;
export const ANALYTICS_DATA_DOMAIN = Cookies.get("aksa__analytics_data_domain");
export const ANALYTICS_SRC = Cookies.get("aksa__analytics_src");
export const CLARITY_ID = Cookies.get("aksa__clarity_id");

