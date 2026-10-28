import axios from "axios";
import store from "../store";
import AuthService from "../service/AuthService/AuthService";
import { setCredentials, clearCredentials } from "../store/Auth/Reducer";
import showAlert from "../components/global/common/MessageBox/AlertService";
import { encrypt } from "../components/global/util/EncryptDecrypt";
import { getAnnualAuditScheduleId } from "../components/global/util/annualAuditSchedule";

const API = axios.create({
  // Local: hit gateway directly (CRA proxy was returning "Invalid CORS request" on POST).
  // Override with REACT_APP_API_BASE_URL when needed (e.g. production reverse-proxy "/api").
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api",
});

API.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const jwtToken = state.jwtAuthentication.jwt;

    if (jwtToken) {
      config.headers["Authorization"] = "Bearer " + jwtToken;
    }

    const auditScheduleId = getAnnualAuditScheduleId();
    if (auditScheduleId) {
      config.headers["X-Annual-Audit-Schedule-Id"] = encrypt(String(auditScheduleId));
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let sessionAlertShown = false;

const redirectToLogin = () => {
  store.dispatch(clearCredentials());
  window.location.replace("/login");
};

const showSessionExpired = () => {
  if (sessionAlertShown) {
    return;
  }
  sessionAlertShown = true;
  showAlert({
    messageTitle: "Session Expired",
    messageContent:
      "Your session has expired. Please login again to continue working.",
    confirmText: "Ok",
    onConfirm: () => {
      redirectToLogin();
    },
    enableHeaderCloseBtn: false,
    disableOutsideKeyDown: true,
  });
};

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config || {};
    const requestUrl = originalRequest.url || "";
    const isRefreshRequest = requestUrl.includes("/refreshtoken");

    if (error.response && error.response.status === 401) {
      if (isRefreshRequest) {
        showSessionExpired();
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = store.getState().jwtAuthentication.refreshToken;

        if (refreshToken) {
          try {
            const response = await AuthService.getNewToken({ refreshToken });
            const user = store.getState().jwtAuthentication;

            store.dispatch(setCredentials({
              name: user.name,
              username: user.username,
              refreshToken: response.data.refreshToken,
              roles: user.roles,
              jwt: response.data.accessToken,
              currentRole: user.currentRole,
              rolePath: user.rolePath,
              homePath: user.homePath,
              roleName: user.roleName,
            }));

            originalRequest.headers["Authorization"] =
              "Bearer " + response.data.accessToken;

            return API(originalRequest);
          } catch (refreshError) {
            showSessionExpired();
            return Promise.reject(refreshError);
          }
        }

        showSessionExpired();
      }
    }

    return Promise.reject(error);
  }
);

export default API;
