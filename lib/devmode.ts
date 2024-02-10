


// Convert the DEV_MODE environment variable to a boolean
// If the environment variable is not set, default to false
// DEV_MODE is used to enable development features

export const DEV_MODE = () => process.env.NODE_ENV === 'development' || false