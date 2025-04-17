#!/bin/bash

# Test Auth Routes Script
# This script tests the auth routes of your fitness app's API
# and saves cookies to cookies.txt for authenticated requests

# Set the base URL for the API
BASE_URL="http://localhost:3001/api/auth"
COOKIE_FILE="cookies.txt"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Test email and password
TEST_EMAIL="test@example.com"
TEST_PASSWORD="password123"
TEST_NAME="Test User"

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

echo "🧪 Testing Auth Routes"
echo "======================="

# Create the cookie file if it doesn't exist
touch "$COOKIE_FILE"

# 1. Test Registration
echo -e "\n${YELLOW}Testing Registration...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
    -H "Content-Type: application/json" \
    -c "$COOKIE_FILE" \
    -d "{\"name\":\"$TEST_NAME\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"agreeToTerms\":true}")

REGISTER_STATUS=$?
echo "$REGISTER_RESPONSE" | jq . 2>/dev/null || echo "$REGISTER_RESPONSE"
print_result $REGISTER_STATUS "Registration" "$REGISTER_RESPONSE"

# Extract user ID if available for later use
USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
if [ -n "$USER_ID" ]; then
    echo "Registered user ID: $USER_ID"
fi

# 2. Test Logout (to clear cookies)
echo -e "\n${YELLOW}Testing Logout...${NC}"
LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/logout" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -c "$COOKIE_FILE")

LOGOUT_STATUS=$?
echo "$LOGOUT_RESPONSE" | jq . 2>/dev/null || echo "$LOGOUT_RESPONSE"
print_result $LOGOUT_STATUS "Logout" "$LOGOUT_RESPONSE"

# 3. Test Login
echo -e "\n${YELLOW}Testing Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
    -H "Content-Type: application/json" \
    -c "$COOKIE_FILE" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"rememberMe\":true}")

LOGIN_STATUS=$?
echo "$LOGIN_RESPONSE" | jq . 2>/dev/null || echo "$LOGIN_RESPONSE"
print_result $LOGIN_STATUS "Login" "$LOGIN_RESPONSE"

# 4. Test Token Refresh
echo -e "\n${YELLOW}Testing Token Refresh...${NC}"
REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/refresh" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -c "$COOKIE_FILE")

REFRESH_STATUS=$?
echo "$REFRESH_RESPONSE" | jq . 2>/dev/null || echo "$REFRESH_RESPONSE"
print_result $REFRESH_STATUS "Token Refresh" "$REFRESH_RESPONSE"

# 5. Test Login with invalid credentials
echo -e "\n${YELLOW}Testing Login with Invalid Credentials...${NC}"
INVALID_LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"wrongpassword\"}")

INVALID_LOGIN_STATUS=$?
echo "$INVALID_LOGIN_RESPONSE" | jq . 2>/dev/null || echo "$INVALID_LOGIN_RESPONSE"
print_result $INVALID_LOGIN_STATUS "Invalid Login (should fail)" "$INVALID_LOGIN_RESPONSE"

# 6. Test Final Logout
echo -e "\n${YELLOW}Testing Final Logout...${NC}"
FINAL_LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/logout" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -c "$COOKIE_FILE")

FINAL_LOGOUT_STATUS=$?
echo "$FINAL_LOGOUT_RESPONSE" | jq . 2>/dev/null || echo "$FINAL_LOGOUT_RESPONSE"
print_result $FINAL_LOGOUT_STATUS "Final Logout" "$FINAL_LOGOUT_RESPONSE"

echo -e "\n${GREEN}Auth Routes Testing Complete!${NC}"
echo "Cookie file saved to: $COOKIE_FILE"

# Display cookie contents
echo -e "\n${YELLOW}Cookie Contents:${NC}"
cat "$COOKIE_FILE"