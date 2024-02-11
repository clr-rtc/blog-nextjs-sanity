


// Convert the NODE_ENV environment variable to a boolean
// This is useful for conditional logic in the code that should only
// be active when the application is running in development mode

export function devMode(){
  return process.env.NODE_ENV === 'development' || false
}