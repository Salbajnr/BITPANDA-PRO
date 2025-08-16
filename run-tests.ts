
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TestResult {
  suite: string;
  status: 'PASS' | 'FAIL';
  duration: number;
  errors?: string[];
}

class TestRunner {
  private results: TestResult[] = [];

  async runTestSuite(suiteName: string, command: string): Promise<TestResult> {
    console.log(`🧪 Running ${suiteName} tests...`);
    const startTime = Date.now();

    try {
      const { stdout, stderr } = await execAsync(command);
      const duration = Date.now() - startTime;

      if (stderr && !stderr.includes('warn')) {
        return {
          suite: suiteName,
          status: 'FAIL',
          duration,
          errors: [stderr]
        };
      }

      console.log(`✅ ${suiteName} tests passed (${duration}ms)`);
      return {
        suite: suiteName,
        status: 'PASS',
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.log(`❌ ${suiteName} tests failed (${duration}ms)`);
      
      return {
        suite: suiteName,
        status: 'FAIL',
        duration,
        errors: [error.message]
      };
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Automated Testing Suite for Crypto Platform\n');

    // Test suites to run
    const testSuites = [
      { name: 'Authentication', command: 'npx vitest run tests/auth.test.ts' },
      { name: 'API Endpoints', command: 'npx vitest run tests/api.test.ts' },
      { name: 'Database Operations', command: 'npx vitest run tests/database.test.ts' },
      { name: 'Frontend Components', command: 'npx vitest run tests/frontend.test.tsx' },
      { name: 'Integration E2E', command: 'npx vitest run tests/integration.test.ts' },
      { name: 'Performance', command: 'npx vitest run tests/performance.test.ts' }
    ];

    // Run all test suites
    for (const suite of testSuites) {
      const result = await this.runTestSuite(suite.name, suite.command);
      this.results.push(result);
    }

    this.generateReport();
  }

  generateReport() {
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================\n');

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    this.results.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${result.suite}: ${result.status} (${result.duration}ms)`);
      
      if (result.errors) {
        result.errors.forEach(error => {
          console.log(`   Error: ${error}`);
        });
      }
    });

    console.log(`\n📈 Results: ${passed} passed, ${failed} failed`);
    console.log(`⏱️  Total time: ${totalDuration}ms`);

    if (failed === 0) {
      console.log('\n🎉 All tests passed! Your crypto platform is ready for deployment.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review and fix the issues above.');
    }

    // Generate detailed report
    this.saveDetailedReport();
  }

  saveDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.status === 'PASS').length,
        failed: this.results.filter(r => r.status === 'FAIL').length,
        totalDuration: this.results.reduce((sum, r) => sum + r.duration, 0)
      },
      results: this.results
    };

    // In a real environment, you'd save this to a file or send to a monitoring service
    console.log('\n📄 Detailed test report generated');
    console.log(JSON.stringify(report, null, 2));
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(console.error);
}

export { TestRunner };
