#!/usr/bin/env python3
"""
User management endpoint tests
"""

import tempfile
import os
import time
from utils import TestCase, create_test_user_data, create_image_file_data, get_measurement_test_values, Colors

# Create unique test user data for this test run
test_user = create_test_user_data(int(time.time() * 1000000))


def setup(runner, auth_url):
    """Setup authentication for user tests"""
    try:
        success = runner.authenticate_user(auth_url, test_user)
        if runner.verbose:
            if success:
                print(f"  {Colors.GREEN}✓ Authentication setup successful{Colors.NC}")
            else:
                print(f"  {Colors.RED}✗ Authentication setup failed{Colors.NC}")
        return success
    except Exception as e:
        if runner.verbose:
            print(f"  {Colors.RED}✗ Authentication setup error: {e}{Colors.NC}")
        return False


def test_unauthenticated_access(client):
    """Test that endpoints require authentication"""
    # Clear any existing session
    client.session.cookies.clear()
    
    return [
        TestCase(
            name="Get user profile without authentication",
            expected_status=401,
            method="GET",
            endpoint="/"
        ),
        TestCase(
            name="Update name without authentication",
            expected_status=401,
            method="PATCH",
            endpoint="/name",
            data={"name": "Updated Name"}
        ),
        TestCase(
            name="Update bio without authentication",
            expected_status=401,
            method="PATCH",
            endpoint="/bio",
            data={"bio": "Test bio"}
        ),
        TestCase(
            name="Get measurements without authentication",
            expected_status=401,
            method="GET",
            endpoint="/measurements/latest"
        ),
    ]


def test_profile_management(client):
    """Test user profile operations"""
    # Re-authenticate for these tests
    client.authenticate("/login", {
        "email": test_user["email"],
        "password": test_user["password"]
    })
    
    return [
        TestCase(
            name="Get user profile",
            expected_status=200,
            method="GET",
            endpoint="/"
        ),
        TestCase(
            name="Update user name",
            expected_status=200,
            method="PATCH",
            endpoint="/name",
            data={"name": "Updated Test User"}
        ),
        TestCase(
            name="Update user name with invalid data",
            expected_status=400,
            method="PATCH",
            endpoint="/name",
            data={}
        ),
        TestCase(
            name="Update user name with non-string",
            expected_status=400,
            method="PATCH",
            endpoint="/name",
            data={"name": 123}
        ),
    ]


def test_bio_management(client):
    """Test bio update functionality"""
    return [
        TestCase(
            name="Update user bio",
            expected_status=200,
            method="PATCH",
            endpoint="/bio",
            data={"bio": "This is a test bio for the user"}
        ),
        TestCase(
            name="Update user bio with empty string",
            expected_status=200,
            method="PATCH",
            endpoint="/bio",
            data={"bio": ""}
        ),
        TestCase(
            name="Update bio with invalid data",
            expected_status=400,
            method="PATCH",
            endpoint="/bio",
            data={}
        ),
        TestCase(
            name="Update bio with non-string",
            expected_status=400,
            method="PATCH",
            endpoint="/bio",
            data={"bio": 123}
        ),
    ]


def test_settings_management(client):
    """Test user settings updates"""
    return [
        TestCase(
            name="Update user settings - dark mode",
            expected_status=200,
            method="PATCH",
            endpoint="/settings",
            data={
                "settings": {
                    "darkMode": True,
                    "language": "en",
                    "defaultMeasurementUnit": "metric"
                }
            }
        ),
        TestCase(
            name="Update user settings - imperial units",
            expected_status=200,
            method="PATCH",
            endpoint="/settings",
            data={
                "settings": {
                    "darkMode": False,
                    "language": "es",
                    "defaultMeasurementUnit": "imperial"
                }
            }
        ),
        TestCase(
            name="Update settings with invalid data",
            expected_status=400,
            method="PATCH",
            endpoint="/settings",
            data={}
        ),
        TestCase(
            name="Update settings with invalid structure",
            expected_status=400,
            method="PATCH",
            endpoint="/settings",
            data={"settings": "invalid"}
        ),
    ]


def test_measurements_retrieval(client):
    """Test measurement retrieval endpoints"""
    return [
        TestCase(
            name="Get latest measurements",
            expected_status=200,
            method="GET",
            endpoint="/measurements/latest"
        ),
        TestCase(
            name="Get measurement history",
            expected_status=200,
            method="GET",
            endpoint="/measurements/history"
        ),
        TestCase(
            name="Get measurement history with limit",
            expected_status=200,
            method="GET",
            endpoint="/measurements/history?limit=5"
        ),
    ]


def test_measurements_valid(client):
    """Test adding valid measurements"""
    measurements = get_measurement_test_values()
    
    return [
        TestCase(
            name="Add weight measurement",
            expected_status=201,
            method="POST",
            endpoint="/measurements/weight",
            data={"value": measurements["valid_weight"]}
        ),
        TestCase(
            name="Add height measurement",
            expected_status=201,
            method="POST",
            endpoint="/measurements/height",
            data={"value": measurements["valid_height"]}
        ),
        TestCase(
            name="Add body fat measurement",
            expected_status=201,
            method="POST",
            endpoint="/measurements/body-fat",
            data={"value": measurements["valid_body_fat"]}
        ),
    ]


def test_measurements_invalid(client):
    """Test adding invalid measurements"""
    measurements = get_measurement_test_values()
    
    return [
        TestCase(
            name="Add weight with invalid value",
            expected_status=400,
            method="POST",
            endpoint="/measurements/weight",
            data={"value": measurements["invalid_weight"]}
        ),
        TestCase(
            name="Add weight without value",
            expected_status=400,
            method="POST",
            endpoint="/measurements/weight",
            data={}
        ),
        TestCase(
            name="Add height with invalid value",
            expected_status=400,
            method="POST",
            endpoint="/measurements/height",
            data={"value": measurements["invalid_height"]}
        ),
        TestCase(
            name="Add body fat with value over 100",
            expected_status=400,
            method="POST",
            endpoint="/measurements/body-fat",
            data={"value": measurements["invalid_body_fat_high"]}
        ),
        TestCase(
            name="Add body fat with negative value",
            expected_status=400,
            method="POST",
            endpoint="/measurements/body-fat",
            data={"value": measurements["invalid_body_fat_negative"]}
        ),
    ]


def test_profile_image_upload(client):
    """Test profile image upload functionality"""
    # Create a temporary test image file
    image_data = create_image_file_data()
    
    # Create temp file with proper cleanup
    temp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
    temp_file.write(image_data)
    temp_file.close()
    temp_image_path = temp_file.name
    
    try:
        tests = [
            TestCase(
                name="Upload profile image",
                expected_status=200,
                method="POST",
                endpoint="/image",
                files={'image': ('test_image.png', open(temp_image_path, 'rb'), 'image/png')}
            ),
            TestCase(
                name="Upload without image file",
                expected_status=400,
                method="POST",
                endpoint="/image"
            ),
        ]
        
        # Test update with a new file handle
        tests.append(TestCase(
            name="Update profile image",
            expected_status=200,
            method="POST",
            endpoint="/image",
            files={'image': ('test_image_updated.png', open(temp_image_path, 'rb'), 'image/png')}
        ))
        
        return tests
        
    finally:
        # Clean up temp file
        if os.path.exists(temp_image_path):
            try:
                os.unlink(temp_image_path)
            except:
                pass  # Ignore cleanup errors


def test_profile_image_retrieval(client):
    """Test profile image retrieval"""
    return [
        TestCase(
            name="Get profile image",
            expected_status=200,
            method="GET",
            endpoint="/image"
        ),
        TestCase(
            name="Get profile image metadata",
            expected_status=200,
            method="GET",
            endpoint="/image/metadata"
        ),
    ]


def test_profile_image_deletion(client):
    """Test profile image deletion"""
    return [
        TestCase(
            name="Delete profile image",
            expected_status=200,
            method="DELETE",
            endpoint="/image"
        ),
        TestCase(
            name="Get deleted profile image",
            expected_status=404,
            method="GET",
            endpoint="/image"
        ),
        TestCase(
            name="Delete non-existent profile image",
            expected_status=404,
            method="DELETE",
            endpoint="/image"
        ),
    ]


def test_edge_cases(client):
    """Test edge cases and security"""
    return [
        TestCase(
            name="Invalid endpoint",
            expected_status=404,
            method="GET",
            endpoint="/invalid-endpoint"
        ),
        TestCase(
            name="Extremely long name",
            expected_status=200,
            method="PATCH",
            endpoint="/name",
            data={"name": "A" * 1000}
        ),
        TestCase(
            name="SQL injection in bio update",
            expected_status=200,
            method="PATCH",
            endpoint="/bio",
            data={"bio": "'; DROP TABLE users; --"}
        ),
    ]