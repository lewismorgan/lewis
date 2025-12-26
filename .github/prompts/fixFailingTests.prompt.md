---
name: fixFailingTests
description: Run unit tests, diagnose failures, and fix all errors until tests pass
argument-hint: Optional test file or pattern to focus on
---

Run the unit tests for the project and fix any errors that occur. Follow this systematic process:

1. **Execute the test suite** to identify failing tests
2. **Analyze failures** by examining error messages, stack traces, and test expectations
3. **Diagnose root causes** - determine if issues are in:
   - Source code logic
   - Test setup or assertions
   - Timing/async handling
   - State management
4. **Apply targeted fixes** to address root causes:
   - Fix component logic if behavior is incorrect
   - Update tests if expectations are wrong
   - Add proper testing utilities (e.g., `act()` for React)
   - Handle timing issues with fake timers appropriately
5. **Re-run tests** to verify fixes work
6. **Iterate** until all tests pass
7. **Verify code quality** with linting

For each fix, ensure:
- Minimal, focused changes that address the specific issue
- No new issues are introduced
- Tests properly validate the intended behavior
- Code follows project conventions and best practices

Continue until the entire test suite passes successfully.
