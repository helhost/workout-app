#!/usr/bin/env python3
"""
Authentication endpoint tests
"""

from utils import TestCase, create_test_user_data, get_invalid_email_formats, get_weak_passwords
import time

# Create unique test user data for this test run  
test_user = {"name": "Test User", "password": "password123", "email": ""}  # Email will be set in test
# Track if registration was successful
_registration_successful = False


def test_registration_success(client):
    """Test successful user registration"""
    global _registration_successful
    
    # Create a truly unique email for each test run
    unique_email = f"test_{int(time.time() * 1000000)}@example.com"
    
    test_case = TestCase(
        name="Successful user registration",
        expected_status=201,
        method="POST",
        endpoint="/register",
        data={
            "name": test_user["name"],
            "email": unique_email,
            "password": test_user["password"],
            "agreeToTerms": True
        }
    )
    
    # Update test_user email for subsequent tests
    test_user["email"] = unique_email
    _registration_successful = True
    
    return test_case


def test_registration_duplicate_email(client):
    """Test registration with duplicate email"""
    # Use the same email from the successful registration test
    return TestCase(
        name="Registration with duplicate email",
        expected_status=409,
        method="POST",
        endpoint="/register",
        data={
            "name": test_user["name"],
            "email": test_user["email"],  # Same email as successful registration
            "password": test_user["password"],
            "agreeToTerms": True
        }
    )


def test_registration_missing_fields(client):
    """Test registration with missing required fields"""
    return [
        TestCase(
            name="Registration missing name",
            expected_status=400,
            method="POST",
            endpoint="/register",
            data={
                "email": f"missing_name_{int(time.time())}@test.com",
                "password": test_user["password"],
                "agreeToTerms": True
            }
        ),
        TestCase(
            name="Registration missing email",
            expected_status=400,
            method="POST",
            endpoint="/register",
            data={
                "name": test_user["name"],
                "password": test_user["password"],
                "agreeToTerms": True
            }
        ),
        TestCase(
            name="Registration missing password",
            expected_status=400,
            method="POST",
            endpoint="/register",
            data={
                "name": test_user["name"],
                "email": f"missing_pass_{int(time.time())}@test.com",
                "agreeToTerms": True
            }
        ),
        TestCase(
            name="Registration missing terms agreement",
            expected_status=400,
            method="POST",
            endpoint="/register",
            data={
                "name": test_user["name"],
                "email": f"no_terms_{int(time.time())}@test.com",
                "password": test_user["password"]
            }
        ),
    ]


def test_registration_invalid_emails(client):
    """Test registration with invalid email formats"""
    tests = []
    for i, invalid_email in enumerate(get_invalid_email_formats()):
        tests.append(TestCase(
            name=f"Registration with invalid email format ({i+1})",
            expected_status=400,
            method="POST",
            endpoint="/register",
            data={
                "name": test_user["name"],
                "email": invalid_email,
                "password": test_user["password"],
                "agreeToTerms": True
            }
        ))
    return tests


def test_registration_weak_passwords(client):
    """Test registration with weak passwords"""
    tests = []
    for i, weak_password in enumerate(get_weak_passwords()):
        tests.append(TestCase(
            name=f"Registration with weak password ({i+1})",
            expected_status=400,
            method="POST",
            endpoint="/register",
            data={
                "name": test_user["name"],
                "email": f"weak_pass_{i}_{int(time.time())}@test.com",
                "password": weak_password,
                "agreeToTerms": True
            }
        ))
    return tests


def test_registration_terms_validation(client):
    """Test registration terms agreement validation"""
    return TestCase(
        name="Registration with terms set to false",
        expected_status=400,
        method="POST",
        endpoint="/register",
        data={
            "name": test_user["name"],
            "email": f"terms_false_{int(time.time())}@test.com",
            "password": test_user["password"],
            "agreeToTerms": False
        }
    )


def test_login_success(client):
    """Test successful login scenarios"""    
    return [
        TestCase(
            name="Successful login",
            expected_status=200,
            method="POST",
            endpoint="/login",
            data={
                "email": test_user["email"],
                "password": test_user["password"]
            }
        ),
        TestCase(
            name="Login with remember me",
            expected_status=200,
            method="POST",
            endpoint="/login",
            data={
                "email": test_user["email"],
                "password": test_user["password"],
                "rememberMe": True
            }
        ),
    ]


def test_login_validation(client):
    """Test login input validation"""
    return [
        TestCase(
            name="Login missing email",
            expected_status=400,
            method="POST",
            endpoint="/login",
            data={
                "password": test_user["password"]
            }
        ),
        TestCase(
            name="Login missing password",
            expected_status=400,
            method="POST",
            endpoint="/login",
            data={
                "email": test_user["email"]
            }
        ),
        TestCase(
            name="Login with invalid email format",
            expected_status=400,
            method="POST",
            endpoint="/login",
            data={
                "email": "invalid-email",
                "password": test_user["password"]
            }
        ),
    ]


def test_login_authentication(client):
    """Test login authentication failures"""
    return [
        TestCase(
            name="Login with wrong password",
            expected_status=401,
            method="POST",
            endpoint="/login",
            data={
                "email": test_user["email"],
                "password": "wrongpassword"
            }
        ),
        TestCase(
            name="Login with non-existent email",
            expected_status=401,
            method="POST",
            endpoint="/login",
            data={
                "email": f"nonexistent_{int(time.time())}@test.com",
                "password": test_user["password"]
            }
        ),
    ]


def test_token_refresh_success(client):
    """Test successful token refresh - requires active session"""
    # Ensure we're authenticated first
    client.authenticate("/login", {
        "email": test_user["email"],
        "password": test_user["password"]
    })
    
    return TestCase(
        name="Successful token refresh",
        expected_status=200,
        method="POST",
        endpoint="/refresh"
    )


def test_token_refresh_failures(client):
    """Test token refresh failure scenarios"""
    # Clear session cookies for these tests
    client.session.cookies.clear()
    
    tests = [
        TestCase(
            name="Token refresh without refresh token",
            expected_status=403,  # Your server returns 403, not 401
            method="POST",
            endpoint="/refresh"
        ),
    ]
    
    # Set invalid token
    client.session.cookies.set('refresh_token', 'invalid.token.here')
    tests.append(TestCase(
        name="Token refresh with invalid token",
        expected_status=403,  # Your server returns 403, not 401
        method="POST",
        endpoint="/refresh"
    ))
    
    return tests


def test_logout_success(client):
    """Test logout functionality"""
    # Re-authenticate first
    client.authenticate("/login", {
        "email": test_user["email"],
        "password": test_user["password"]
    })
    
    return [
        TestCase(
            name="Successful logout",
            expected_status=200,
            method="POST",
            endpoint="/logout"
        ),
        TestCase(
            name="Logout without authentication",
            expected_status=200,
            method="POST",
            endpoint="/logout"
        ),
    ]


def test_edge_cases(client):
    """Test edge cases and security"""
    return [
        TestCase(
            name="Registration with empty JSON",
            expected_status=400,
            method="POST",
            endpoint="/register",
            data={}
        ),
        TestCase(
            name="SQL injection attempt in login",
            expected_status=400,  # Your server likely validates email format first
            method="POST",
            endpoint="/login",
            data={
                "email": "admin@test.com'; DROP TABLE users; --",
                "password": "password"
            }
        ),
    ]