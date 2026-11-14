const API_ENDPOINTS = {
    APPLICATIONS: {
        BY_USER_ID: (userId) =>
            `/api/v1/applications/${userId}`,

        CREATE: `/api/v1/applications`,

        UPDATE: (applicationId) =>
            `/api/v1/applications/${applicationId}`,

        DELETE: (applicationId) =>
            `/api/v1/applications/${applicationId}`,

    },

    ANALYTICS: {
        BY_USER_ID: (userId) => `/api/v1/analytics/${userId}`,
    },

    AUTH: {
        SEND_OTP: `/api/v1/auth/send-otp`,
        VERIFY_OTP: `/api/v1/auth/verify-otp`,
        SIGN_UP: `/api/v1/auth/sign-up`,
        LOGIN: `/api/v1/auth/login`,
        REFRESH: `/api/v1/auth/refresh`,
        LOGOUT: `/api/v1/auth/logout`,
    }
};

export default API_ENDPOINTS;