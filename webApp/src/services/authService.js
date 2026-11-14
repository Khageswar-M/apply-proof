
import API_ENDPOINTS from "../components/api/endpoints";
import responseGateway from "../components/api/responseGateway";

const authService = {

    sendOtp(email) {
        return responseGateway.post(
            API_ENDPOINTS.AUTH.SEND_OTP,
            { email }
        );
    },

    verifyOtp(email, otp) {
        return responseGateway.post(
            API_ENDPOINTS.AUTH.VERIFY_OTP,
            { email, otp }
        );
    },

    signUp(email) {
        return responseGateway.post(
            API_ENDPOINTS.AUTH.SIGN_UP,
            { email }
        );
    },

    login(email) {
        return responseGateway.post(
            API_ENDPOINTS.AUTH.LOGIN,
            { email }
        );
    },

    refresh() {
        return responseGateway.post(
            API_ENDPOINTS.AUTH.REFRESH
        );
    },

    logout() {
        return responseGateway.post(
            API_ENDPOINTS.AUTH.LOGOUT
        );
    }
};

export default authService;
