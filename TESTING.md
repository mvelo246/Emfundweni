# Testing Guide

This project uses **Test-Driven Development (TDD)** approach with comprehensive test coverage for both backend and frontend.

## Test Structure

### Backend Tests (`backend/__tests__/`)
- **database.test.js** - Database schema, table creation, and initialization tests
- **auth.test.js** - Authentication endpoints (login, token verification)
- **schoolInfo.test.js** - School information CRUD operations
- **topStudents.test.js** - Top students CRUD operations
- **integration.test.js** - End-to-end integration tests

### Frontend Tests (`frontend/src/__tests__/`)
- **api.test.ts** - API service layer tests
- **components/Hero.test.tsx** - Hero component tests
- **components/About.test.tsx** - About component tests
- **admin/EditSchoolInfo.test.tsx** - Admin form tests
- **admin/Login.test.tsx** - Login component tests

## Running Tests

### Backend Tests

```bash
cd backend
npm install
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm test -- --coverage
```

### Frontend Tests

```bash
cd frontend
npm install
npm test
```

Run tests in watch mode (default with react-scripts):
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

### Run All Tests

From the root directory:
```bash
# Install dependencies
npm run install:all

# Run backend tests
cd backend && npm test && cd ..

# Run frontend tests
cd frontend && npm test && cd ..
```

## Test Coverage

### Backend Coverage
- ✅ Database initialization and schema
- ✅ Authentication (login, token verification)
- ✅ School info CRUD operations
- ✅ Top students CRUD operations
- ✅ Input validation
- ✅ Error handling
- ✅ Authorization checks

### Frontend Coverage
- ✅ API service layer
- ✅ Component rendering
- ✅ User interactions
- ✅ Form submissions
- ✅ Error handling
- ✅ Loading states

## Test Examples

### Backend Test Example
```javascript
test('should update school information with valid token', async () => {
  const updateData = {
    school_name: 'Test School',
    mission: 'Test Mission',
    // ... other fields
  };

  const response = await request(app)
    .put('/api/school-info')
    .set('Authorization', `Bearer ${authToken}`)
    .send(updateData);

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message');
});
```

### Frontend Test Example
```typescript
test('should render hero section with school info', async () => {
  (api.getSchoolInfo as jest.Mock).mockResolvedValue({
    data: mockSchoolInfo
  });

  render(<Hero />);

  await waitFor(() => {
    expect(screen.getByText('Welcome to Test School')).toBeInTheDocument();
  });
});
```

## Writing New Tests

### TDD Workflow
1. **Red**: Write a failing test
2. **Green**: Write minimal code to make it pass
3. **Refactor**: Improve code while keeping tests green

### Test Naming Convention
- Use descriptive test names
- Follow pattern: `should [expected behavior] when [condition]`
- Example: `should reject login with incorrect password`

### Test Structure
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  test('should do something', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## Continuous Integration

Tests should be run:
- Before committing code
- In CI/CD pipeline
- Before deploying to production

## Troubleshooting

### Backend Tests
- Ensure test database is cleaned up between runs
- Check that test database path doesn't conflict with production DB
- Verify all dependencies are installed

### Frontend Tests
- Clear mocks between tests
- Ensure React Testing Library is properly configured
- Check that all components are properly exported

## Coverage Goals

- **Backend**: >80% code coverage
- **Frontend**: >70% code coverage
- **Critical paths**: 100% coverage (auth, data updates)

