import axiosClient from "./axiosClient";
import ApiError from "../utils/ApiError";

const responseGateway = {
    async executeRequest(config) {
        try {
            const response = await axiosClient(config);

            const responseData = response.data;

            return {
                success: true,
                message: responseData?.message ?? "Request successful",
                data: responseData?.data ?? null,
                status: response.status,
            };

        } catch (error) {

            let apiError;

            if (
                error.code === "ECONNABORTED" ||
                error.code === "ETIMEDOUT"
            ) {
                apiError = new ApiError({
                    message: "Request timed out. Please try again.",
                    code: "TIMEOUT",
                });

            } else if (error.response) {

                const responseData = error.response.data;

                apiError = new ApiError({
                    message:
                        responseData?.message ||
                        responseData?.error ||
                        "Something went wrong",

                    status: error.response.status,
                    code: responseData?.code,
                    data: responseData,
                });

            } else if (error.request) {

                apiError = new ApiError({
                    message: "Unable to connect to the server",
                    code: "NETWORK_ERROR",
                });

            } else {

                apiError = new ApiError({
                    message: error.message || "Unexpected error occurred",
                    code: "UNKNOWN_ERROR",
                });
            }

            return {
                success: false,
                message: apiError.message,
                data: null,
                status: apiError.status,
                error: apiError,
            };
        }
    },

    get(url, config = {}) {
        return this.executeRequest({
            ...config,
            method: "GET",
            url,
        });
    },

    post(url, data, config = {}) {
        return this.executeRequest({
            ...config,
            method: "POST",
            url,
            data,
        });
    },

    put(url, data, config = {}) {
        return this.executeRequest({
            ...config,
            method: "PUT",
            url,
            data,
        });
    },

    delete(url, config = {}) {
        return this.executeRequest({
            ...config,
            method: "DELETE",
            url,
        });
    },
};

export default responseGateway;