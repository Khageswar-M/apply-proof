import responseGateway from "../components/api/responseGateway";
import API_ENDPOINTS from "../components/api/endpoints";

const applicationService = {

    // GET applications by user ID
    getApplicationsByUserId(userId) {
        return responseGateway.get(
            API_ENDPOINTS.APPLICATIONS.BY_USER_ID(userId)
        );
    },

    // POST create application
    createApplication(applicationData) {
        return responseGateway.post(
            API_ENDPOINTS.APPLICATIONS.CREATE,
            applicationData
        );
    },

    // PUT update application
    updateApplication(applicationId, applicationData) {
        return responseGateway.put(
            API_ENDPOINTS.APPLICATIONS.UPDATE(applicationId),
            applicationData
        );
    },

    // DELETE application
    deleteApplication(applicationId) {
        return responseGateway.delete(
            API_ENDPOINTS.APPLICATIONS.DELETE(applicationId)
        );
    },
    
};

export default applicationService;