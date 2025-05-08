# API Automation Testing Framework

This project is a robust API automation testing framework built with TypeScript and Jest. It provides a structured approach to API testing with comprehensive reporting capabilities.

## 🚀 Features

- TypeScript-based test framework
- Jest as the testing engine
- Multiple reporting formats (JUnit, HTML)
- Structured test organization
- Environment configuration support
- Request/response logging
- Test data management

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd api_automation
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## 📁 Project Structure

```
api_automation/
├── src/
│   ├── config/           # Configuration files
│   ├── tests/            # Test files
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript type definitions
├── reports/              # Test reports
│   ├── html_reports/     # HTML test reports
│   └── html_reports_2/   # Additional HTML reports
├── jest.config.js        # Jest configuration
└── package.json          # Project dependencies
```

## 🧪 Running Tests

### Run all tests
```bash
npm test
# or
yarn test
```

### Run specific test file
```bash
npm test -- [test-file-path]
# or
yarn test [test-file-path]
```

## 📊 Test Reports

The framework generates multiple types of reports:

1. **JUnit Report**: Available in the default reports directory
2. **HTML Reports**: 
   - Primary report: `./reports/html_reports/test-report.html`
   - Secondary report: `./reports/html_reports_2/report.html`

Reports include:
- Test execution status
- Failure messages
- Console logs
- Stack traces
- Suite failures

## ⚙️ Configuration

### Jest Configuration
The project uses a custom Jest configuration (`jest.config.js`) with:
- TypeScript support via ts-jest
- Multiple reporters configuration
- Node.js test environment

### Environment Configuration
Environment-specific configurations can be managed through the `config` directory.

## 🛠️ Development

### Adding New Tests
1. Create a new test file in the `src/tests` directory
2. Follow the existing test structure
3. Use the provided utility functions from `src/utils`

### Best Practices
- Keep tests independent
- Use meaningful test descriptions
- Follow the AAA pattern (Arrange, Act, Assert)
- Clean up test data after execution

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Jest team for the testing framework
- TypeScript team for the language support 