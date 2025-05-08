/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./reports", // 👈 MATCH THIS TO JENKINS
        outputName: "junit.xml",
        suiteName: "jest tests",
        classNameTemplate: "{classname}-{title}",
        titleTemplate: "{title}",
        ancestorSeparator: " › ",
        usePathForSuiteName: "true"
      }
    ],
    [
      "jest-html-reporter",
      {
        pageTitle: "Test Report 1",
        outputPath: "./reports/test-report.html",
        includeFailureMsg: true,
        includeSuiteFailure: true,
        includeConsoleLog: true,
        includeStackTrace: true
      }
    ],
    [
      "jest-html-reporters",
      {
        publicPath: "./reports/",
        filename: "report.html",
        expand: true,
        openReport: true
      }
    ]
  ]
};
