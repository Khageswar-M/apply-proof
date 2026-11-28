
import responseGateway from "../components/api/responseGateway";
import API_ENDPOINTS from "../components/api/endpoints";

const applicationService = {

    // GET applications by user ID
    getApplicationsByUserId(userId, page = 0, size = 10) {
        return responseGateway.get(
            API_ENDPOINTS.APPLICATIONS.BY_USER_ID(userId, page, size)
        );
    },

    // CREATE application
    createApplication(applicationData) {
        return responseGateway.post(
            API_ENDPOINTS.APPLICATIONS.CREATE,
            applicationData
        );
    },

    // UPDATE application
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

    // SEARCH BY USER ID & COMPANY NAME
    searchByCompanyName(userId, companyName, page = 0, size = 10) {
        return responseGateway.post(
            API_ENDPOINTS.APPLICATIONS.SEARCH(page, size),
            { userId, companyName }
        );
    },

    // FILTER APPLICATIONS

    filterLatestApplications(userId, page = 0, size = 10) {
        return responseGateway.get(
            API_ENDPOINTS.APPLICATIONS.LATEST(userId, page, size)
        );
    },

    filterLastWeekApplications(userId, page = 0, size = 10) {
        return responseGateway.get(
            API_ENDPOINTS.APPLICATIONS.LAST_WEEK(userId, page, size)
        );
    },

    filterLastMonthApplications(userId, page = 0, size = 10) {
        return responseGateway.get(
            API_ENDPOINTS.APPLICATIONS.LAST_MONTH(userId, page, size)
        );
    },

    filterLastSixMonthApplications(userId, page = 0, size = 10) {
        return responseGateway.get(
            API_ENDPOINTS.APPLICATIONS.LAST_SIX_MONTH(userId, page, size)
        );
    },

    filterLastYearApplications(userId, page = 0, size = 10) {
        return responseGateway.get(
            API_ENDPOINTS.APPLICATIONS.LAST_YEAR(userId, page, size)
        );
    }
};

export default applicationService;
