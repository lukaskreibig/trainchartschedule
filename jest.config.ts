const nextJest = require('next/jest')

const createJestConfig = nextJest()

const customJestConfig = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    // Add more setup options before each test is run
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  }

// Take the returned async function
const asyncConfig = createJestConfig(customJestConfig)

// and wrap it
module.exports = async () => {
  const config = await asyncConfig()
  config.transformIgnorePatterns = [
    '/node_modules/(?!d3|internmap|d3-.*)/'
  ]
  config.moduleNameMapper = {
    // Map "@/app/*" to "<rootDir>/app/*"
    '^@/app/(.*)$': '<rootDir>/src/app/$1',

  };
  return config
}