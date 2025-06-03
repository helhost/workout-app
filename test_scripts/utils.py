#!/usr/bin/env python3
"""
Core utility functions for API testing
"""

import requests
import json
import time
import base64
from typing import Dict, Any, Optional, Tuple
from dataclasses import dataclass


class Colors:
    """ANSI color codes for terminal output"""
    GREEN = '\033[0;32m'
    RED = '\033[0;31m'
    YELLOW = '\033[0;33m'
    BLUE = '\033[0;34m'
    CYAN = '\033[0;36m'
    BOLD = '\033[1m'
    NC = '\033[0m'  # No Color


@dataclass
class TestCase:
    """Represents a single test case"""
    name: str
    expected_status: int
    method: str
    endpoint: str
    data: Optional[Dict[str, Any]] = None
    files: Optional[Dict[str, Any]] = None
    headers: Optional[Dict[str, str]] = None
    description: Optional[str] = None


@dataclass
class TestResult:
    """Test result with metadata"""
    name: str
    passed: bool
    expected_status: int
    actual_status: int
    response_data: Optional[Dict[str, Any]]
    error_message: Optional[str] = None
    duration: float = 0.0


class HTTPClient:
    """HTTP client for making API requests"""
    
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
    
    def request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                files: Optional[Dict] = None, headers: Optional[Dict] = None) -> Tuple[int, Dict, float]:
        """Make HTTP request and return status, data, duration"""
        start_time = time.time()
        
        url = f"{self.base_url}{endpoint}"
        request_headers = headers or {}
        
        # Set default content type for JSON requests
        if data and 'Content-Type' not in request_headers:
            request_headers['Content-Type'] = 'application/json'
        
        try:
            response = self.session.request(
                method=method,
                url=url,
                json=data if data else None,
                files=files,
                headers=request_headers,
                timeout=30
            )
            
            duration = time.time() - start_time
            
            # Parse response
            try:
                response_data = response.json() if response.content else {}
            except json.JSONDecodeError:
                response_data = {"raw_content": response.text}
            
            return response.status_code, response_data, duration
            
        except requests.exceptions.RequestException as e:
            duration = time.time() - start_time
            return 0, {"error": str(e)}, duration
    
    def authenticate(self, endpoint: str, credentials: Dict[str, Any]) -> bool:
        """Authenticate and store session cookies"""
        status, data, _ = self.request("POST", endpoint, credentials)
        success = status in [200, 201]
        return success
    
    def check_connection(self) -> bool:
        """Check if the server is reachable"""
        try:
            response = self.session.get(self.base_url, timeout=5)
            return True
        except requests.exceptions.RequestException:
            return False


def run_test(client: HTTPClient, test_case: TestCase) -> TestResult:
    """Execute a single test case"""
    status, response_data, duration = client.request(
        test_case.method,
        test_case.endpoint,
        test_case.data,
        test_case.files,
        test_case.headers
    )
    
    if status == 0:  # Request failed
        return TestResult(
            name=test_case.name,
            passed=False,
            expected_status=test_case.expected_status,
            actual_status=0,
            response_data=response_data,
            error_message=response_data.get("error", "Request failed"),
            duration=duration
        )
    
    passed = status == test_case.expected_status
    error_message = None if passed else response_data.get('error', 'Status code mismatch')
    
    return TestResult(
        name=test_case.name,
        passed=passed,
        expected_status=test_case.expected_status,
        actual_status=status,
        response_data=response_data,
        error_message=error_message,
        duration=duration
    )


def create_test_user_data(timestamp: Optional[int] = None) -> Dict[str, str]:
    """Create test user data with unique email"""
    if timestamp is None:
        timestamp = int(time.time())
    
    return {
        "email": f"test_{timestamp}@example.com",
        "password": "password123",
        "name": "Test User"
    }


def create_image_file_data() -> bytes:
    """Create a small test image (1x1 pixel PNG)"""
    # 1x1 pixel transparent PNG
    png_data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    return base64.b64decode(png_data)


def get_invalid_email_formats() -> list[str]:
    """Get list of invalid email formats for testing"""
    return [
        "invalid-email",
        "@example.com",
        "test@",
        "test.example.com",
        "test@.com",
        ""
    ]


def get_weak_passwords() -> list[str]:
    """Get list of weak passwords for testing"""
    return [
        "",
        "123",
        "pass",
        "1234567"  # exactly 7 chars, should fail 8+ requirement
    ]


def get_measurement_test_values() -> Dict[str, Any]:
    """Get test values for measurement testing"""
    return {
        "valid_weight": 75.5,
        "valid_height": 180.0,
        "valid_body_fat": 15.5,
        "invalid_weight": -10,
        "invalid_height": 0,
        "invalid_body_fat_high": 150,
        "invalid_body_fat_negative": -5
    }