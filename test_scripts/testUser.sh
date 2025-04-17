#!/bin/bash

# Test User Routes Script
# This script tests the user routes of your fitness app's API
# It depends on testAuth.sh for authentication

# Set the base URLs for the API
AUTH_URL="http://localhost:3001/api/auth"
USER_URL="http://localhost:3001/api/profile"
COOKIE_FILE="cookies.txt"
TEST_IMAGE="test_image.jpg"  # Make sure this file exists in the same directory

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test user credentials
TEST_EMAIL="test@example.com"
TEST_PASSWORD="password123"

# Function to print colored output
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
        echo "Error Response:"
        echo "$3"
    fi
}

# Function to print section headers
print_section() {
    echo -e "\n${BLUE}$1${NC}"
    echo "----------------------------------------"
}

echo "🧪 Testing User Routes"
echo "======================="

# First, authenticate with the API
print_section "Authenticating with the API"

# Login to get authentication cookies
echo -e "${YELLOW}Logging in...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$AUTH_URL/login" \
    -H "Content-Type: application/json" \
    -c "$COOKIE_FILE" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

LOGIN_STATUS=$?
echo "$LOGIN_RESPONSE" | jq . 2>/dev/null || echo "$LOGIN_RESPONSE"
print_result $LOGIN_STATUS "Login" "$LOGIN_RESPONSE"

# Extract user ID for later use
USER_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
if [ -n "$USER_ID" ]; then
    echo "User ID: $USER_ID"
else
    echo -e "${RED}Failed to extract User ID. Some tests may fail.${NC}"
fi

# Now test all the user routes

# 1. Test GET User
print_section "Testing GET User"
PROFILE_RESPONSE=$(curl -s -X GET "$USER_URL/" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")

PROFILE_STATUS=$?
echo "$PROFILE_RESPONSE" | jq . 2>/dev/null || echo "$PROFILE_RESPONSE"
print_result $PROFILE_STATUS "Get Profile" "$PROFILE_RESPONSE"

# 2. Test Update Username
print_section "Testing Update Username"
USERNAME_RESPONSE=$(curl -s -X PATCH "$USER_URL/name" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"name\":\"Updated Test User\"}")

USERNAME_STATUS=$?
echo "$USERNAME_RESPONSE" | jq . 2>/dev/null || echo "$USERNAME_RESPONSE"
print_result $USERNAME_STATUS "Update Username" "$USERNAME_RESPONSE"

# 3. Test Update Bio
print_section "Testing Update Bio"
BIO_RESPONSE=$(curl -s -X PATCH "$USER_URL/bio" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"bio\":\"This is a test bio created by the testing script.\"}")

BIO_STATUS=$?
echo "$BIO_RESPONSE" | jq . 2>/dev/null || echo "$BIO_RESPONSE"
print_result $BIO_STATUS "Update Bio" "$BIO_RESPONSE"

# 4. Test Update Settings
print_section "Testing Update Settings"
SETTINGS_RESPONSE=$(curl -s -X PATCH "$USER_URL/settings" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"settings\":{\"darkMode\":true,\"language\":\"en\",\"defaultMeasurementUnit\":\"imperial\"}}")

SETTINGS_STATUS=$?
echo "$SETTINGS_RESPONSE" | jq . 2>/dev/null || echo "$SETTINGS_RESPONSE"
print_result $SETTINGS_STATUS "Update Settings" "$SETTINGS_RESPONSE"

# 5. Test Get Latest Measurements
print_section "Testing Get Latest Measurements"
LATEST_MEASUREMENTS_RESPONSE=$(curl -s -X GET "$USER_URL/measurements/latest" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")

LATEST_MEASUREMENTS_STATUS=$?
echo "$LATEST_MEASUREMENTS_RESPONSE" | jq . 2>/dev/null || echo "$LATEST_MEASUREMENTS_RESPONSE"
print_result $LATEST_MEASUREMENTS_STATUS "Get Latest Measurements" "$LATEST_MEASUREMENTS_RESPONSE"

# 6. Test Add Weight Measurement
print_section "Testing Add Weight Measurement"
WEIGHT_RESPONSE=$(curl -s -X POST "$USER_URL/measurements/weight" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"value\":75.5}")

WEIGHT_STATUS=$?
echo "$WEIGHT_RESPONSE" | jq . 2>/dev/null || echo "$WEIGHT_RESPONSE"
print_result $WEIGHT_STATUS "Add Weight Measurement" "$WEIGHT_RESPONSE"

# 7. Test Add Height Measurement
print_section "Testing Add Height Measurement"
HEIGHT_RESPONSE=$(curl -s -X POST "$USER_URL/measurements/height" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"value\":180.5}")

HEIGHT_STATUS=$?
echo "$HEIGHT_RESPONSE" | jq . 2>/dev/null || echo "$HEIGHT_RESPONSE"
print_result $HEIGHT_STATUS "Add Height Measurement" "$HEIGHT_RESPONSE"

# 8. Test Add Body Fat Measurement
print_section "Testing Add Body Fat Measurement"
BODYFAT_RESPONSE=$(curl -s -X POST "$USER_URL/measurements/body-fat" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"value\":15.5}")

BODYFAT_STATUS=$?
echo "$BODYFAT_RESPONSE" | jq . 2>/dev/null || echo "$BODYFAT_RESPONSE"
print_result $BODYFAT_STATUS "Add Body Fat Measurement" "$BODYFAT_RESPONSE"

# 9. Test Get Measurement History
print_section "Testing Get Measurement History"
HISTORY_RESPONSE=$(curl -s -X GET "$USER_URL/measurements/history?limit=10" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")

HISTORY_STATUS=$?
echo "$HISTORY_RESPONSE" | jq . 2>/dev/null || echo "$HISTORY_RESPONSE"
print_result $HISTORY_STATUS "Get Measurement History" "$HISTORY_RESPONSE"

# 10. Test Image Upload (if test image exists)
print_section "Testing Profile Image Operations"

if [ -f "$TEST_IMAGE" ]; then
    echo -e "${YELLOW}Uploading profile image...${NC}"
    UPLOAD_RESPONSE=$(curl -s -X POST "$USER_URL/image" \
        -b "$COOKIE_FILE" \
        -F "image=@$TEST_IMAGE")

    UPLOAD_STATUS=$?
    echo "$UPLOAD_RESPONSE" | jq . 2>/dev/null || echo "$UPLOAD_RESPONSE"
    print_result $UPLOAD_STATUS "Upload Profile Image" "$UPLOAD_RESPONSE"

    # 11. Test Get Image Metadata
    echo -e "${YELLOW}Getting image metadata...${NC}"
    METADATA_RESPONSE=$(curl -s -X GET "$USER_URL/image/metadata" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_FILE")

    METADATA_STATUS=$?
    echo "$METADATA_RESPONSE" | jq . 2>/dev/null || echo "$METADATA_RESPONSE"
    print_result $METADATA_STATUS "Get Image Metadata" "$METADATA_RESPONSE"

    # 12. Test Get Image (don't display binary data)
    echo -e "${YELLOW}Getting image (binary data not displayed)...${NC}"
    IMAGE_RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$USER_URL/image" -b "$COOKIE_FILE")
    
    if [ "$IMAGE_RESPONSE_CODE" == "200" ]; then
        echo -e "${GREEN}✓ Get Profile Image (Status Code: $IMAGE_RESPONSE_CODE)${NC}"
    else
        echo -e "${RED}✗ Get Profile Image (Status Code: $IMAGE_RESPONSE_CODE)${NC}"
    fi

    # 13. Test Delete Image
    echo -e "${YELLOW}Deleting profile image...${NC}"
    DELETE_IMAGE_RESPONSE=$(curl -s -X DELETE "$USER_URL/image" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_FILE")

    DELETE_IMAGE_STATUS=$?
    echo "$DELETE_IMAGE_RESPONSE" | jq . 2>/dev/null || echo "$DELETE_IMAGE_RESPONSE"
    print_result $DELETE_IMAGE_STATUS "Delete Profile Image" "$DELETE_IMAGE_RESPONSE"
else
    echo -e "${YELLOW}Skipping image tests since '$TEST_IMAGE' file not found.${NC}"
    echo "To test image uploads, create a test image file named '$TEST_IMAGE' in the same directory."
fi

# Logout at the end
print_section "Logging out"
LOGOUT_RESPONSE=$(curl -s -X POST "$AUTH_URL/logout" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -c "$COOKIE_FILE")

LOGOUT_STATUS=$?
echo "$LOGOUT_RESPONSE" | jq . 2>/dev/null || echo "$LOGOUT_RESPONSE"
print_result $LOGOUT_STATUS "Logout" "$LOGOUT_RESPONSE"

echo -e "\n${GREEN}User Routes Testing Complete!${NC}"