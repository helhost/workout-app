#!/bin/bash

# Comprehensive Test User Routes Script
# Tests all success and failure scenarios for user routes

# Set the base URL for the API
BASE_URL="http://localhost:3001/api"
COOKIE_FILE="cookies.txt"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test data
TEST_EMAIL="user_test_${RANDOM}@example.com"
TEST_PASSWORD="password123"
TEST_NAME="Test User"
NEW_NAME="Updated User"
TEST_BIO="This is my test bio"
UPDATED_BIO="This is my updated bio"

# Counters
PASSED_TESTS=0
FAILED_TESTS=0

# Function to print colored output
print_result() {
    local expected_success=$1
    local test_name=$2
    local response=$3
    local http_code=$(echo "$response" | tail -n1 | grep -o '"status":[0-9]*' | sed 's/"status"://')

    if [[ "$http_code" =~ ^2[0-9][0-9]$ ]]; then
        actual_success=true
    else
        actual_success=false
    fi

    if [ "$expected_success" = "$actual_success" ]; then
        echo -e "${GREEN}✓ $test_name${NC}"
        local response_body=$(echo "$response" | sed '$d')  # remove last line (status)
        parsed_response=$(echo "$response_body" | jq -c . 2>/dev/null)
        if [ -n "$parsed_response" ]; then
            echo "Response: $parsed_response"
        else
            echo "Response: $response"
        fi
        PASSED_TESTS=$((PASSED_TESTS+1))
    else
        echo -e "${RED}✗ $test_name${NC}"
        echo "Expected: $expected_success, Got: $actual_success (HTTP $http_code)"
        echo "Response: $response"
        FAILED_TESTS=$((FAILED_TESTS+1))
    fi
    echo "---"
}



# Function to print section headers
print_section() {
    echo -e "\n${BLUE}═══ $1 ═══${NC}"
}

echo "Comprehensive User Routes Testing"
echo "===================================="

# Create the cookie file if it doesn't exist
touch "$COOKIE_FILE"

# ============ SETUP: Create and login user ============
print_section "SETUP: Creating test user and logging in"

echo -e "${YELLOW}Setup: Register test user${NC}"
REGISTER_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -c "$COOKIE_FILE" \
    -d "{\"name\":\"$TEST_NAME\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"agreeToTerms\":true}")
print_result true "User Registration" "$REGISTER_RESPONSE"

# Extract user ID from registration response
USER_ID=$(echo "$REGISTER_RESPONSE" | head -n-1 | jq -r '.data.id' 2>/dev/null)

# ============ USER PROFILE TESTS ============
print_section "USER PROFILE TESTS"

echo -e "${YELLOW}Test: Get user profile (authenticated)${NC}"
GET_PROFILE_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X GET "$BASE_URL/user" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")
print_result true "Get user profile" "$GET_PROFILE_RESPONSE"

echo -e "${YELLOW}Test: Get user profile without authentication (should fail)${NC}"
GET_PROFILE_NO_AUTH_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X GET "$BASE_URL/user" \
    -H "Content-Type: application/json")
print_result false "Get profile without auth" "$GET_PROFILE_NO_AUTH_RESPONSE"

# ============ USERNAME UPDATE TESTS ============
print_section "USERNAME UPDATE TESTS"

echo -e "${YELLOW}Test: Update username successfully${NC}"
UPDATE_NAME_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/name" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"name\":\"$NEW_NAME\"}")
print_result true "Update username" "$UPDATE_NAME_RESPONSE"

echo -e "${YELLOW}Test: Update username with empty name (should fail)${NC}"
EMPTY_NAME_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/name" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"name\":\"\"}")
print_result false "Update with empty name" "$EMPTY_NAME_RESPONSE"

echo -e "${YELLOW}Test: Update username without name field (should fail)${NC}"
NO_NAME_FIELD_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/name" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{}")
print_result false "Update without name field" "$NO_NAME_FIELD_RESPONSE"

echo -e "${YELLOW}Test: Update username with non-string value (should fail)${NC}"
INVALID_NAME_TYPE_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/name" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"name\":123}")
print_result false "Update with non-string name" "$INVALID_NAME_TYPE_RESPONSE"

echo -e "${YELLOW}Test: Update username without authentication (should fail)${NC}"
UPDATE_NAME_NO_AUTH_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/name" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$NEW_NAME\"}")
print_result false "Update name without auth" "$UPDATE_NAME_NO_AUTH_RESPONSE"

# ============ BIO UPDATE TESTS ============
print_section "BIO UPDATE TESTS"

echo -e "${YELLOW}Test: Update bio successfully${NC}"
UPDATE_BIO_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/bio" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"bio\":\"$TEST_BIO\"}")
print_result true "Update bio" "$UPDATE_BIO_RESPONSE"

echo -e "${YELLOW}Test: Update bio with empty string (should succeed)${NC}"
EMPTY_BIO_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/bio" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"bio\":\"\"}")
print_result true "Update with empty bio" "$EMPTY_BIO_RESPONSE"

echo -e "${YELLOW}Test: Update bio without bio field (should fail)${NC}"
NO_BIO_FIELD_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/bio" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{}")
print_result false "Update without bio field" "$NO_BIO_FIELD_RESPONSE"

echo -e "${YELLOW}Test: Update bio with non-string value (should fail)${NC}"
INVALID_BIO_TYPE_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/bio" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"bio\":true}")
print_result false "Update with non-string bio" "$INVALID_BIO_TYPE_RESPONSE"

echo -e "${YELLOW}Test: Update bio with long text${NC}"
LONG_BIO="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
LONG_BIO_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/bio" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"bio\":\"$LONG_BIO\"}")
print_result true "Update with long bio" "$LONG_BIO_RESPONSE"

# ============ SETTINGS UPDATE TESTS ============
print_section "SETTINGS UPDATE TESTS"

echo -e "${YELLOW}Test: Update settings successfully${NC}"
UPDATE_SETTINGS_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/settings" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"settings\":{\"darkMode\":true,\"language\":\"es\",\"defaultMeasurementUnit\":\"imperial\"}}")
print_result true "Update settings" "$UPDATE_SETTINGS_RESPONSE"

echo -e "${YELLOW}Test: Update partial settings${NC}"
PARTIAL_SETTINGS_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/settings" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"settings\":{\"darkMode\":false}}")
print_result true "Update partial settings" "$PARTIAL_SETTINGS_RESPONSE"

echo -e "${YELLOW}Test: Update settings without settings object (should fail)${NC}"
NO_SETTINGS_OBJECT_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/settings" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{}")
print_result false "Update without settings object" "$NO_SETTINGS_OBJECT_RESPONSE"

echo -e "${YELLOW}Test: Update settings with invalid type (should fail)${NC}"
INVALID_SETTINGS_TYPE_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/settings" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"settings\":\"not an object\"}")
print_result false "Update with invalid settings type" "$INVALID_SETTINGS_TYPE_RESPONSE"

# ============ PROFILE IMAGE TESTS ============
print_section "PROFILE IMAGE TESTS"

echo -e "${YELLOW}Test: Get profile image metadata (no image yet, should fail)${NC}"
GET_IMAGE_METADATA_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X GET "$BASE_URL/user/image/metadata" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")
print_result false "Get image metadata (no image)" "$GET_IMAGE_METADATA_RESPONSE"

echo -e "${YELLOW}Test: Upload profile image${NC}"
# Create a test image file
echo -e "\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde" > test_image.png
UPLOAD_IMAGE_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/user/image" \
    -b "$COOKIE_FILE" \
    -F "image=@test_image.png;type=image/png")
print_result true "Upload profile image" "$UPLOAD_IMAGE_RESPONSE"

echo -e "${YELLOW}Test: Get profile image${NC}"
GET_IMAGE_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X GET "$BASE_URL/user/image" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")
print_result true "Get profile image" "$GET_IMAGE_RESPONSE"

echo -e "${YELLOW}Test: Get profile image metadata (after upload)${NC}"
GET_IMAGE_METADATA_AFTER_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X GET "$BASE_URL/user/image/metadata" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")
print_result true "Get image metadata (after upload)" "$GET_IMAGE_METADATA_AFTER_RESPONSE"

echo -e "${YELLOW}Test: Upload image without file (should fail)${NC}"
NO_FILE_UPLOAD_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/user/image" \
    -b "$COOKIE_FILE")
print_result false "Upload without file" "$NO_FILE_UPLOAD_RESPONSE"

echo -e "${YELLOW}Test: Delete profile image${NC}"
DELETE_IMAGE_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X DELETE "$BASE_URL/user/image" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")
print_result true "Delete profile image" "$DELETE_IMAGE_RESPONSE"

echo -e "${YELLOW}Test: Delete profile image again (should fail)${NC}"
DELETE_IMAGE_AGAIN_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X DELETE "$BASE_URL/user/image" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")
print_result false "Delete image again" "$DELETE_IMAGE_AGAIN_RESPONSE"

# Clean up test image
rm -f test_image.png

# ============ MEASUREMENTS TESTS ============
print_section "MEASUREMENTS TESTS"

echo -e "${YELLOW}Test: Get latest measurements (empty)${NC}"
GET_LATEST_MEASUREMENTS_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X GET "$BASE_URL/user/measurements/latest" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")
print_result true "Get latest measurements" "$GET_LATEST_MEASUREMENTS_RESPONSE"

echo -e "${YELLOW}Test: Add weight measurement${NC}"
ADD_WEIGHT_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/user/measurements/weight" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"value\":75.5}")
print_result true "Add weight measurement" "$ADD_WEIGHT_RESPONSE"

echo -e "${YELLOW}Test: Add weight with invalid value (should fail)${NC}"
INVALID_WEIGHT_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/user/measurements/weight" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"value\":-10}")
print_result false "Add negative weight" "$INVALID_WEIGHT_RESPONSE"

echo -e "${YELLOW}Test: Add weight without value (should fail)${NC}"
NO_WEIGHT_VALUE_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/user/measurements/weight" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{}")
print_result false "Add weight without value" "$NO_WEIGHT_VALUE_RESPONSE"

echo -e "${YELLOW}Test: Add height measurement${NC}"
ADD_HEIGHT_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/user/measurements/height" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"value\":180}")
print_result true "Add height measurement" "$ADD_HEIGHT_RESPONSE"

echo -e "${YELLOW}Test: Add height with string value (should fail)${NC}"
STRING_HEIGHT_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/user/measurements/height" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"value\":\"180cm\"}")
print_result false "Add height with string" "$STRING_HEIGHT_RESPONSE"

echo -e "${YELLOW}Test: Add body fat measurement${NC}"
ADD_BODYFAT_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/user/measurements/body-fat" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"value\":15.5}")
print_result true "Add body fat measurement" "$ADD_BODYFAT_RESPONSE"

echo -e "${YELLOW}Test: Add body fat with invalid percentage (should fail)${NC}"
INVALID_BODYFAT_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/user/measurements/body-fat" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"value\":150}")
print_result false "Add body fat >100%" "$INVALID_BODYFAT_RESPONSE"

echo -e "${YELLOW}Test: Get latest measurements (after adding)${NC}"
GET_LATEST_AFTER_ADD_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X GET "$BASE_URL/user/measurements/latest" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")
print_result true "Get latest measurements after add" "$GET_LATEST_AFTER_ADD_RESPONSE"

echo -e "${YELLOW}Test: Get measurement history${NC}"
GET_HISTORY_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X GET "$BASE_URL/user/measurements/history" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")
print_result true "Get measurement history" "$GET_HISTORY_RESPONSE"

echo -e "${YELLOW}Test: Get measurement history with limit${NC}"
GET_HISTORY_LIMIT_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X GET "$BASE_URL/user/measurements/history?limit=5" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")
print_result true "Get history with limit" "$GET_HISTORY_LIMIT_RESPONSE"

# ============ AUTHENTICATION TESTS FOR ALL ENDPOINTS ============
print_section "AUTHENTICATION TESTS"

echo -e "${YELLOW}Test: Access measurements without auth (should fail)${NC}"
MEASUREMENTS_NO_AUTH_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X GET "$BASE_URL/user/measurements/latest" \
    -H "Content-Type: application/json")
print_result false "Measurements without auth" "$MEASUREMENTS_NO_AUTH_RESPONSE"

echo -e "${YELLOW}Test: Update bio without auth (should fail)${NC}"
BIO_NO_AUTH_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/bio" \
    -H "Content-Type: application/json" \
    -d "{\"bio\":\"test\"}")
print_result false "Update bio without auth" "$BIO_NO_AUTH_RESPONSE"

echo -e "${YELLOW}Test: Upload image without auth (should fail)${NC}"
# Create temp image for this test
echo -e "\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde" > temp_test_image.png
IMAGE_NO_AUTH_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/user/image" \
    -F "image=@temp_test_image.png;type=image/png")
print_result false "Upload image without auth" "$IMAGE_NO_AUTH_RESPONSE"
rm -f temp_test_image.png

# ============ EDGE CASES ============
print_section "EDGE CASES"

echo -e "${YELLOW}Test: Invalid JSON in request body${NC}"
INVALID_JSON_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/name" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "invalid json")
print_result false "Invalid JSON" "$INVALID_JSON_RESPONSE"

echo -e "${YELLOW}Test: Extremely long name update${NC}"
LONG_NAME=$(printf 'A%.0s' {1..1000})
LONG_NAME_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/name" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"name\":\"$LONG_NAME\"}")
# This might succeed or fail depending on validation rules
print_result true "Extremely long name" "$LONG_NAME_RESPONSE"

echo -e "${YELLOW}Test: Multiple rapid measurements${NC}"
RAPID_TEST_SUCCESS=true
for i in {1..3}; do
    RAPID_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/user/measurements/weight" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_FILE" \
        -d "{\"value\":$((70 + i))}")
    HTTP_CODE=$(echo "$RAPID_RESPONSE" | tail -n1 | grep -o '"status":[0-9]*' | sed 's/"status"://')
    if [[ ! "$HTTP_CODE" =~ ^2[0-9][0-9]$ ]]; then
        RAPID_TEST_SUCCESS=false
        break
    fi
done
print_result true "Multiple rapid measurements" "$RAPID_RESPONSE"

echo -e "${YELLOW}Test: Special characters in name${NC}"
SPECIAL_NAME="Test User 特殊文字 🎉"
SPECIAL_NAME_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/name" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"name\":\"$SPECIAL_NAME\"}")
print_result true "Name with special characters" "$SPECIAL_NAME_RESPONSE"

echo -e "${YELLOW}Test: SQL injection attempt in bio (should be safely handled)${NC}"
SQL_INJECTION_BIO="'; DROP TABLE users; --"
SQL_INJECTION_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/bio" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"bio\":\"$SQL_INJECTION_BIO\"}")
print_result true "SQL injection attempt (safely handled)" "$SQL_INJECTION_RESPONSE"

echo -e "${YELLOW}Test: XSS attempt in name (should be safely handled)${NC}"
XSS_NAME="<script>alert('XSS')</script>"
XSS_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/name" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"name\":\"$XSS_NAME\"}")
print_result true "XSS attempt (safely handled)" "$XSS_RESPONSE"

echo -e "${YELLOW}Test: Null value in settings${NC}"
NULL_SETTINGS_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/settings" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"settings\":null}")
print_result false "Null settings value" "$NULL_SETTINGS_RESPONSE"

echo -e "${YELLOW}Test: Array instead of object for settings${NC}"
ARRAY_SETTINGS_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/settings" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"settings\":[]}")
print_result false "Array for settings" "$ARRAY_SETTINGS_RESPONSE"

echo -e "${YELLOW}Test: Very large settings object${NC}"
LARGE_SETTINGS="{\"settings\":{"
for i in {1..100}; do
    LARGE_SETTINGS="${LARGE_SETTINGS}\"setting$i\":\"value$i\","
done
LARGE_SETTINGS="${LARGE_SETTINGS}\"final\":\"value\"}}"
LARGE_SETTINGS_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X PATCH "$BASE_URL/user/settings" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "$LARGE_SETTINGS")
print_result true "Large settings object" "$LARGE_SETTINGS_RESPONSE"

echo -e "${YELLOW}Test: Float value for height${NC}"
FLOAT_HEIGHT_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/user/measurements/height" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"value\":175.5}")
print_result true "Float height value" "$FLOAT_HEIGHT_RESPONSE"

echo -e "${YELLOW}Test: Zero weight (should fail)${NC}"
ZERO_WEIGHT_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/user/measurements/weight" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"value\":0}")
print_result false "Zero weight" "$ZERO_WEIGHT_RESPONSE"

echo -e "${YELLOW}Test: Verify profile changes persisted${NC}"
FINAL_PROFILE_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X GET "$BASE_URL/user" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")
print_result true "Final profile check" "$FINAL_PROFILE_RESPONSE"

# ============ CLEANUP ============
print_section "CLEANUP"

echo -e "${YELLOW}Logging out${NC}"
LOGOUT_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/auth/logout" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -c "$COOKIE_FILE")
print_result true "Logout" "$LOGOUT_RESPONSE"

# ============ SUMMARY ============
echo -e "\n${GREEN}User Routes Testing Complete!${NC}"
echo -e "\n${BLUE}═══ TEST SUMMARY ═══${NC}"
TOTAL_TESTS=$((PASSED_TESTS + FAILED_TESTS))
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo -e "${BLUE}Total: $TOTAL_TESTS${NC}"

# Calculate percentage
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$(echo "scale=2; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc)
    echo -e "\n${YELLOW}Success Rate: ${SUCCESS_RATE}%${NC}"
fi

# Clean up
rm -f "$COOKIE_FILE"

# Exit with appropriate code
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}Some tests failed!${NC}"
    exit 1
fi