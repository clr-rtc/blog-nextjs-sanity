/**
 * devmode.ts
 * This file contains a single function to determine if the application is running in development mode.
 */

/**
 * @summary Determines if the application is running in development mode.
 * @returns {boolean} true if the application is running in development mode, false otherwise
 * @description Converts the NODE_ENV environment variable to a boolean.
 * This is useful for conditional logic in the code that should only
 * be active when the application is running in development mode.
 * Use a function instead of a constant to avoid timing problems with
 * when dotenv loads the environment variables
 */
export function devMode(){
  return process.env.NODE_ENV === 'development' || false
}