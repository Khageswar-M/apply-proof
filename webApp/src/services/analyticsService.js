import responseGateway from "../components/api/responseGateway";
import API_ENDPOINTS from "../components/api/endpoints";

const analyticsService = {
    getApplicationStatsByUserId(userId) {
        return responseGateway.get(API_ENDPOINTS.ANALYTICS.BY_USER_ID(userId));
    }
}

export default analyticsService;