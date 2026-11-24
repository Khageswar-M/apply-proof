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


    // SEARCH BY USER-ID & COMPANY-NAME
    searchByCompanyName(userId, companyName) {
        return responseGateway.post(
            API_ENDPOINTS.APPLICATIONS.SEARCH,
            { userId, companyName }
        );
    },

    //=========FILTER==========
    // filter latest applications
    filterLatestApplications(userId){
        return responseGateway.get(
            API_ENDPOINTS.APPLICATIONS.LATEST,
            {
                params: {userId}
            }
        );
    },

    // filter last week applications
    filterLastWeekApplications(userId) {
        return responseGateway.get(
            API_ENDPOINTS.APPLICATIONS.LAST_WEEK,
            {
                params: {userId}
            }
        );
    },

    // filter last month applications
    filterLastMonthApplications(userId) {
        return responseGateway.get(
            API_ENDPOINTS.APPLICATIONS.LAST_MONTH,
            {
                params: {userId}
            }
        );
    },


    
};

export default applicationService;