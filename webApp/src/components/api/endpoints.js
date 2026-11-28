
const APPLICATIONS_API_END_POINT_V1 = '/api/v1/applications'
const ANALYTICS_API_END_POINT_v1 = '/api/v1/analytics'
const AUTH_API_END_POINT_V1 = '/api/v1/auth'

const API_ENDPOINTS = {
    APPLICATIONS: {

        BY_USER_ID: (userId, page = 0, size = 10) =>
            `${APPLICATIONS_API_END_POINT_V1}/${userId}?page=${page}&size=${size}`,

        CREATE: APPLICATIONS_API_END_POINT_V1,

        UPDATE: (applicationId) =>
            `${APPLICATIONS_API_END_POINT_V1}/${applicationId}`,

        DELETE: (applicationId) =>
            `${APPLICATIONS_API_END_POINT_V1}/${applicationId}`,

        SEARCH: (page = 0, size = 10) =>
            `${APPLICATIONS_API_END_POINT_V1}/search?page=${page}&size=${size}`,

        // FILTERS

        LATEST: (userId, page = 0, size = 10) =>
            `${APPLICATIONS_API_END_POINT_V1}/filter/latest/${userId}?page=${page}&size=${size}`,

        LAST_WEEK: (userId, page = 0, size = 10) =>
            `${APPLICATIONS_API_END_POINT_V1}/filter/last-week/${userId}?page=${page}&size=${size}`,

        LAST_MONTH: (userId, page = 0, size = 10) =>
            `${APPLICATIONS_API_END_POINT_V1}/filter/last-month/${userId}?page=${page}&size=${size}`,

        LAST_SIX_MONTH: (userId, page = 0, size = 10) =>
            `${APPLICATIONS_API_END_POINT_V1}/filter/last-six-month/${userId}?page=${page}&size=${size}`,

        LAST_YEAR: (userId, page = 0, size = 10) =>
            `${APPLICATIONS_API_END_POINT_V1}/filter/last-year/${userId}?page=${page}&size=${size}`
    },

    ANALYTICS: {
        BY_USER_ID: (userId) => `${ANALYTICS_API_END_POINT_v1}/${userId}`,
    },

    AUTH: {
        SEND_OTP: `${AUTH_API_END_POINT_V1}/send-otp`,
        VERIFY_OTP: `${AUTH_API_END_POINT_V1}/verify-otp`,
        SIGN_UP: `${AUTH_API_END_POINT_V1}/sign-up`,
        LOGIN: `${AUTH_API_END_POINT_V1}/login`,
        REFRESH: `${AUTH_API_END_POINT_V1}/refresh`,
        LOGOUT: `${AUTH_API_END_POINT_V1}/logout`,
    }
};

export default API_ENDPOINTS;