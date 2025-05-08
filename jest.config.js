/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  reporters: [
    'default',
    'jest-junit',
    ['jest-html-reporter', {
      "pageTitle": "Test Report 1",
      "outputPath": "./reports/html_reports/test-report.html",
      "includeFailureMsg": true,
      "includeSuiteFailure": true,
      "includeConsoleLog": true,
      "includeStackTrace": true
    }],
    ['jest-html-reporters', {
      "publicPath": "./reports/html_reports_2",
      "filename": "report.html",
      "expand": true,
      "openReport": true
    }]
  ]
};