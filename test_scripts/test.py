#!/usr/bin/env python3
"""
Main test runner for API testing
"""

import sys
import argparse
import json
import importlib
import os
from typing import List, Dict, Any
from utils import HTTPClient, TestResult, Colors, run_test


class TestRunner:
    """Main test runner class"""
    
    def __init__(self, base_url: str, verbose: bool = False):
        self.base_url = base_url
        self.verbose = verbose
        self.client = HTTPClient(base_url)
        self.results: List[TestResult] = []
        self.passed_tests = 0
        self.failed_tests = 0
        self.total_tests = 0
    
    def print_header(self, text: str) -> None:
        """Print a formatted header"""
        print(f"\n{Colors.BLUE}{'═' * 63}{Colors.NC}")
        print(f"{Colors.BLUE}{text.center(63)}{Colors.NC}")
        print(f"{Colors.BLUE}{'═' * 63}{Colors.NC}\n")
    
    def print_section(self, text: str) -> None:
        """Print a section header"""
        if self.verbose:
            print(f"\n{Colors.CYAN}── {text} ──{Colors.NC}")
    
    def execute_test(self, test_case) -> None:
        """Execute a single test case"""
        if self.verbose:
            print(f"{Colors.YELLOW}▶ {test_case.name}{Colors.NC}")
        
        result = run_test(self.client, test_case)
        self.results.append(result)
        self.total_tests += 1
        
        if result.passed:
            self.passed_tests += 1
            if self.verbose:
                print(f"  {Colors.GREEN}✓ PASS{Colors.NC} (HTTP {result.actual_status})")
                if result.response_data and isinstance(result.response_data, dict):
                    message = result.response_data.get('message', '')
                    if message:
                        print(f"  {Colors.GREEN}  → {message}{Colors.NC}")
        else:
            self.failed_tests += 1
            if self.verbose:
                print(f"  {Colors.RED}✗ FAIL{Colors.NC} (Expected: {result.expected_status}, Got: {result.actual_status})")
                if result.error_message:
                    print(f"  {Colors.RED}  → {result.error_message}{Colors.NC}")
        
        if self.verbose:
            print()
    
    def run_test_suite(self, test_module, suite_name: str) -> None:
        """Run a test suite from a module"""
        self.print_section(f"{suite_name.upper()} TESTS")
        
        # Get all test functions from the module and sort them to ensure consistent order
        test_functions = []
        for name in sorted(dir(test_module)):
            if name.startswith('test_') and callable(getattr(test_module, name)):
                test_functions.append((name, getattr(test_module, name)))
        
        # Sort test functions to run in logical order for auth tests
        if suite_name.lower() == 'auth':
            # Define the order for auth tests
            auth_order = [
                'test_registration_success',
                'test_registration_duplicate_email', 
                'test_registration_missing_fields',
                'test_registration_invalid_emails',
                'test_registration_weak_passwords',
                'test_registration_terms_validation',
                'test_login_success',
                'test_login_validation',
                'test_login_authentication',
                'test_token_refresh_success',
                'test_token_refresh_failures',
                'test_logout_success',
                'test_edge_cases'
            ]
            
            # Sort based on the defined order
            def get_order_index(func_name):
                try:
                    return auth_order.index(func_name)
                except ValueError:
                    return len(auth_order)  # Put unknown tests at the end
            
            test_functions.sort(key=lambda x: get_order_index(x[0]))
        
        elif suite_name.lower() == 'user':
            # Define the order for user tests
            user_order = [
                'test_unauthenticated_access',
                'test_profile_management',
                'test_bio_management',
                'test_settings_management',
                'test_measurements_retrieval',
                'test_measurements_valid',
                'test_measurements_invalid',
                'test_profile_image_upload',
                'test_profile_image_retrieval',
                'test_profile_image_deletion',
                'test_edge_cases'
            ]
            
            # Sort based on the defined order
            def get_user_order_index(func_name):
                try:
                    return user_order.index(func_name)
                except ValueError:
                    return len(user_order)
            
            test_functions.sort(key=lambda x: get_user_order_index(x[0]))
        
        for func_name, test_func in test_functions:
            test_cases = test_func(self.client)
            if not isinstance(test_cases, list):
                test_cases = [test_cases]
            
            for test_case in test_cases:
                self.execute_test(test_case)
    
    def authenticate_user(self, auth_url: str, user_data: Dict[str, Any]) -> bool:
        """Authenticate a user for testing"""
        # Create a temporary HTTP client for the auth URL
        auth_client = HTTPClient(auth_url)
        
        # Try to register first
        register_success = auth_client.authenticate("/register", {
            "name": user_data["name"],
            "email": user_data["email"],
            "password": user_data["password"],
            "agreeToTerms": True
        })
        
        if register_success:
            # Copy cookies from auth client to main client
            self.client.session.cookies.update(auth_client.session.cookies)
            if self.verbose:
                print(f"  {Colors.GREEN}✓ User registered and authenticated{Colors.NC}")
            return True
        
        # If registration failed, try login (user might already exist)
        login_success = auth_client.authenticate("/login", {
            "email": user_data["email"],
            "password": user_data["password"]
        })
        
        if login_success:
            # Copy cookies from auth client to main client
            self.client.session.cookies.update(auth_client.session.cookies)
            if self.verbose:
                print(f"  {Colors.GREEN}✓ User authenticated via login{Colors.NC}")
            return True
        
        if self.verbose:
            print(f"  {Colors.RED}✗ Authentication failed{Colors.NC}")
        return False
    
    def print_summary(self) -> bool:
        """Print test execution summary"""
        self.print_header("TEST SUMMARY")
        
        pass_rate = (self.passed_tests * 100 // self.total_tests) if self.total_tests > 0 else 0
        
        print(f"{Colors.BLUE}Total Tests:{Colors.NC}  {self.total_tests}")
        print(f"{Colors.GREEN}Passed:{Colors.NC}       {self.passed_tests}")
        print(f"{Colors.RED}Failed:{Colors.NC}       {self.failed_tests}")
        print(f"{Colors.CYAN}Pass Rate:{Colors.NC}    {pass_rate}%")
        
        # Show failed tests if any
        if self.failed_tests > 0:
            print(f"\n{Colors.RED}Failed Tests:{Colors.NC}")
            for result in self.results:
                if not result.passed:
                    print(f"  {Colors.RED}✗{Colors.NC} {result.name}")
                    if result.error_message:
                        print(f"    {Colors.RED}→{Colors.NC} {result.error_message}")
                    else:
                        print(f"    {Colors.RED}→{Colors.NC} Expected: {result.expected_status}, Got: {result.actual_status}")
        
        if self.failed_tests == 0:
            print(f"\n{Colors.GREEN}All tests passed!{Colors.NC}")
            return True
        else:
            print(f"\n{Colors.RED}Some tests failed. Run with -v for details.{Colors.NC}")
            return False
    
    def generate_report(self, filename: str) -> None:
        """Generate JSON test report"""
        report = {
            "summary": {
                "total_tests": self.total_tests,
                "passed_tests": self.passed_tests,
                "failed_tests": self.failed_tests,
                "pass_rate": (self.passed_tests * 100 // self.total_tests) if self.total_tests > 0 else 0
            },
            "results": [
                {
                    "test_name": result.name,
                    "passed": result.passed,
                    "expected_status": result.expected_status,
                    "actual_status": result.actual_status,
                    "duration": result.duration,
                    "error_message": result.error_message
                }
                for result in self.results
            ]
        }
        
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"{Colors.CYAN}Test report saved to: {filename}{Colors.NC}")


def load_test_module(module_name: str):
    """Load a test module from the tests directory"""
    try:
        # Add tests directory to path if it exists
        if os.path.exists('tests'):
            sys.path.insert(0, 'tests')
        
        return importlib.import_module(module_name)
    except ImportError as e:
        print(f"{Colors.RED}Error loading test module '{module_name}': {e}{Colors.NC}")
        return None


def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="API Test Runner")
    parser.add_argument("module", nargs="?", default="auth", 
                       help="Test module to run (default: auth)")
    parser.add_argument("-v", "--verbose", action="store_true", 
                       help="Verbose output")
    parser.add_argument("--base-url", default="http://localhost:3001/api", 
                       help="Base URL for API")
    parser.add_argument("--auth-url", default="http://localhost:3001/api/auth", 
                       help="Auth URL for authentication")
    parser.add_argument("--report", help="Generate JSON report file")
    parser.add_argument("--list", action="store_true", 
                       help="List available test modules")
    
    args = parser.parse_args()
    
    # List available test modules
    if args.list:
        print("Available test modules:")
        tests_dir = 'tests' if os.path.exists('tests') else '.'
        for file in os.listdir(tests_dir):
            if file.endswith('.py') and not file.startswith('__'):
                module_name = file[:-3]
                if module_name not in ['utils', 'test']:
                    print(f"  - {module_name}")
        return
    
    # Determine the correct base URL for the module
    if args.module == "auth":
        base_url = args.auth_url
    else:
        base_url = f"{args.base_url}/{args.module}"
    
    # Initialize test runner
    runner = TestRunner(base_url, verbose=args.verbose)
    
    # Print header
    runner.print_header(f"{args.module.upper()} ROUTES TESTING")
    
    # Check server connection
    if not runner.client.check_connection():
        print(f"{Colors.RED}Error: Cannot connect to server at {base_url}{Colors.NC}")
        print(f"{Colors.YELLOW}Please ensure the server is running{Colors.NC}")
        sys.exit(1)
    
    print(f"{Colors.GREEN}Server connection successful{Colors.NC}")
    
    # Load and run test module
    test_module = load_test_module(args.module)
    if not test_module:
        sys.exit(1)
    
    # Run setup if it exists
    if hasattr(test_module, 'setup'):
        if runner.verbose:
            print(f"{Colors.CYAN}Setting up authentication...{Colors.NC}")
        if not test_module.setup(runner, args.auth_url):
            print(f"{Colors.RED}Test setup failed. Please check your server and auth configuration.{Colors.NC}")
            if runner.verbose:
                print(f"{Colors.YELLOW}Debug info:{Colors.NC}")
                print(f"  Auth URL: {args.auth_url}")
                print(f"  Base URL: {base_url}")
                print(f"  Test user: {getattr(test_module, 'test_user', 'Not found')}")
            sys.exit(1)
    
    # Run the test suite
    runner.run_test_suite(test_module, args.module)
    
    # Print summary
    success = runner.print_summary()
    
    # Generate report if requested
    if args.report:
        runner.generate_report(args.report)
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()