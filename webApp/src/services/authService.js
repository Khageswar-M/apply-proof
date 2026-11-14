import API_ENDPOINTS from "../components/api/endpoints";
import responseGateway from "../components/api/responseGateway";

const { AUTH } = API_ENDPOINTS;

// Every call resolves to { success, message, data, status, error? } — never throws.
export const sendOtp = (email) => responseGateway.post(AUTH.SEND_OTP, { email });
export const verifyOtp = (email, otp) => responseGateway.post(AUTH.VERIFY_OTP, { email, otp });
export const signUp = (email) => responseGateway.post(AUTH.SIGN_UP, { email });
export const login = (email) => responseGateway.post(AUTH.LOGIN, { email });
export const refresh = () => responseGateway.post(AUTH.REFRESH);
export const logout = () => responseGateway.post(AUTH.LOGOUT);