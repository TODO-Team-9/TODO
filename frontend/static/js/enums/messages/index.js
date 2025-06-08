export const Message = {
    Error: {
        Auth: {
            LOGIN_FAILED: "Login failed",
            SESSION_EXPIRED: "Session expired",
            NOT_AUTHENTICATED: "Not authenticated",
            FAILED_USER_DATA: "Failed to get user data",
            FAILED_USERNAME: "Failed to set username"
        },
        Validation: {
            INVALID_INPUT: "Invalid input provided",
            REQUIRED_FIELD: "This field is required",
            INVALID_FORMAT: "Invalid format"
        },
        System: {
            SERVER_ERROR: "An unexpected server error occurred",
            FAILED_STATS: "Error loading statistics",
            UNKNOWN_ERROR: "Unknown error",
            STYLES_LOAD_ERROR: "Error loading styles"
        }
    },

    Status: {
        System: {
            LOADING: "Loading, please wait...",
            SUCCESS: "Operation completed successfully",
            STYLES_LOADED: "Styles loaded successfully"
        },
        Auth: {
            WELCOME: "Welcome to the application",
            LOGIN_REQUIRED: "Please log in to continue",
            LOGOUT_SUCCESS: "Successfully logged out"
        }
    },
}; 