
const APPLICATIONS_API_END_POINT_V1 = '/api/v1/applications'
const ANALYTICS_API_END_POINT_v1 = '/api/v1/analytics'
const AUTH_API_END_POINT_V1 = '/api/v1/auth'

const API_ENDPOINTS = {
    APPLICATIONS: {
        BY_USER_ID: (userId) =>
            `${APPLICATIONS_API_END_POINT_V1}/${userId}`,

        CREATE: `${APPLICATIONS_API_END_POINT_V1}`,

        UPDATE: (applicationId) =>
            `${APPLICATIONS_API_END_POINT_V1}/${applicationId}`,

        DELETE: (applicationId) =>
            `${APPLICATIONS_API_END_POINT_V1}/${applicationId}`,

        SEARCH: `${APPLICATIONS_API_END_POINT_V1}/search`,

        // FILTERS
        LATEST: `${APPLICATIONS_API_END_POINT_V1}/filter/latest`,
        LAST_WEEK: `${APPLICATIONS_API_END_POINT_V1}/filter/last-week`,
        LAST_MONTH: `${APPLICATIONS_API_END_POINT_V1}/filter/last-month`,
        LAST_SIX_MONTH: `${APPLICATIONS_API_END_POINT_V1}/filter/last-six-month`,
        LAST_YEAR: `${APPLICATIONS_API_END_POINT_V1}/filter/last-year`

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