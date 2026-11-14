class ApiError extends Error {
    constructor({
        message,
        status = null,
        code = null,
        data = null,
    }) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.data = data;
    }
}

export default ApiError;