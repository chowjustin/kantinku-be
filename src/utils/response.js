const buildResponseSuccess = (message, data) => {
    return {
        status: true,
        message: message,
        data: data,
        meta: null
    };
}

const buildResponseFailed = (message, error, data) => {
    return {
        status: false,
        message: message,
        error: error,
        data: data,
        meta: null
    };
}

module.exports = {
    buildResponseFailed,
    buildResponseSuccess
}