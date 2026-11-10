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
    }
};

export default API_ENDPOINTS;