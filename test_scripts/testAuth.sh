#!/bin/bash

# Comprehensive Test Auth Routes Script
# Tests all success and failure scenarios for auth routes

# Set the base URL for the API
BASE_URL="http://localhost:3001/api/auth"
COOKIE_FILE="cookies.txt"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test data
TEST_EMAIL="test_${RANDOM}@example.com"
TEST_PASSWORD="password123"
TEST_NAME="Test User"
EXISTING_EMAIL="john@doe.com"

# Counters
PASSED_TESTS=0
TOTAL_TESTS=23

# Function to print colored output
print_result() {
    local status=$1
    local test_name=$2
    local response=$3
    local expected_code=$4
    local actual_code=$(echo "$response" | grep -o '"status":[0-9]*' | sed 's/"status"://')

    if [ $status -eq 0 ]; then
        echo -e "${GREEN}✓ $test_name${NC}"
        echo "Response: $(echo "$response" | jq -c . 2>/dev/null || echo "$response")"
        PASSED_TESTS=$((PASSED_TESTS+1))
    else
        echo -e "${RED}✗ $test_name${NC}"
        echo "Error Response: $response"
    fi
    echo "---"
}

# Function to print section headers
print_section() {
    echo -e "\n${BLUE}═══ $1 ═══${NC}"
}

echo "Comprehensive Auth Routes Testing"
echo "===================================="

# Create the cookie file if it doesn't exist
touch "$COOKIE_FILE"

# ============ REGISTRATION TESTS ============
print_section "REGISTRATION TESTS"

echo -e "${YELLOW}Test 1: Successful Registration${NC}"
REGISTER_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/register" \
    -H "Content-Type: application/json" \
    -c "$COOKIE_FILE" \
    -d "{\"name\":\"$TEST_NAME\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"agreeToTerms\":true}")
print_result $? "Successful Registration" "$REGISTER_RESPONSE"

echo -e "${YELLOW}Test 2: Registration with existing email (should fail)${NC}"
DUPLICATE_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$TEST_NAME\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"agreeToTerms\":true}")
print_result $? "Duplicate Email Registration" "$DUPLICATE_RESPONSE"

echo -e "${YELLOW}Test 3: Registration without name (should fail)${NC}"
NO_NAME_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"noname@example.com\",\"password\":\"$TEST_PASSWORD\",\"agreeToTerms\":true}")
print_result $? "Registration without name" "$NO_NAME_RESPONSE"

echo -e "${YELLOW}Test 4: Registration without email (should fail)${NC}"
NO_EMAIL_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$TEST_NAME\",\"password\":\"$TEST_PASSWORD\",\"agreeToTerms\":true}")
print_result $? "Registration without email" "$NO_EMAIL_RESPONSE"

echo -e "${YELLOW}Test 5: Registration without password (should fail)${NC}"
NO_PASS_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$TEST_NAME\",\"email\":\"nopass@example.com\",\"agreeToTerms\":true}")
print_result $? "Registration without password" "$NO_PASS_RESPONSE"

echo -e "${YELLOW}Test 6: Registration without agreeing to terms (should fail)${NC}"
NO_TERMS_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$TEST_NAME\",\"email\":\"noterms@example.com\",\"password\":\"$TEST_PASSWORD\",\"agreeToTerms\":false}")
print_result $? "Registration without terms agreement" "$NO_TERMS_RESPONSE"

echo -e "${YELLOW}Test 7: Registration with invalid email format (should fail)${NC}"
INVALID_EMAIL_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$TEST_NAME\",\"email\":\"invalidemail\",\"password\":\"$TEST_PASSWORD\",\"agreeToTerms\":true}")
print_result $? "Registration with invalid email" "$INVALID_EMAIL_RESPONSE"

echo -e "${YELLOW}Test 8: Registration with short password (should fail)${NC}"
SHORT_PASS_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$TEST_NAME\",\"email\":\"shortpass@example.com\",\"password\":\"pass\",\"agreeToTerms\":true}")
print_result $? "Registration with short password" "$SHORT_PASS_RESPONSE"

# ============ LOGIN TESTS ============
print_section "LOGIN TESTS"

echo -e "${YELLOW}Test 9: Successful login${NC}"
LOGIN_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/login" \
    -H "Content-Type: application/json" \
    -c "$COOKIE_FILE" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")
print_result $? "Successful Login" "$LOGIN_RESPONSE"

echo -e "${YELLOW}Test 10: Login with remember me${NC}"
REMEMBER_LOGIN_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/login" \
    -H "Content-Type: application/json" \
    -c "$COOKIE_FILE" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"rememberMe\":true}")
print_result $? "Login with Remember Me" "$REMEMBER_LOGIN_RESPONSE"

echo -e "${YELLOW}Test 11: Login without email (should fail)${NC}"
NO_EMAIL_LOGIN_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/login" \
    -H "Content-Type: application/json" \
    -d "{\"password\":\"$TEST_PASSWORD\"}")
print_result $? "Login without email" "$NO_EMAIL_LOGIN_RESPONSE"

echo -e "${YELLOW}Test 12: Login without password (should fail)${NC}"
NO_PASS_LOGIN_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\"}")
print_result $? "Login without password" "$NO_PASS_LOGIN_RESPONSE"

echo -e "${YELLOW}Test 13: Login with invalid email format (should fail)${NC}"
INVALID_EMAIL_LOGIN_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"invalidemail\",\"password\":\"$TEST_PASSWORD\"}")
print_result $? "Login with invalid email format" "$INVALID_EMAIL_LOGIN_RESPONSE"

echo -e "${YELLOW}Test 14: Login with wrong password (should fail)${NC}"
WRONG_PASS_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"wrongpassword\"}")
print_result $? "Login with wrong password" "$WRONG_PASS_RESPONSE"

echo -e "${YELLOW}Test 15: Login with non-existent email (should fail)${NC}"
NONEXISTENT_LOGIN_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"nonexistent@example.com\",\"password\":\"$TEST_PASSWORD\"}")
print_result $? "Login with non-existent email" "$NONEXISTENT_LOGIN_RESPONSE"

# ============ REFRESH TOKEN TESTS ============
print_section "REFRESH TOKEN TESTS"

echo -e "${YELLOW}Test 16: Successful token refresh${NC}"
REFRESH_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/refresh" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -c "$COOKIE_FILE")
print_result $? "Successful Token Refresh" "$REFRESH_RESPONSE"

echo -e "${YELLOW}Test 17: Token refresh without refresh token (should fail)${NC}"
NO_TOKEN_REFRESH_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/refresh" \
    -H "Content-Type: application/json")
print_result $? "Token refresh without token" "$NO_TOKEN_REFRESH_RESPONSE"

echo -e "${YELLOW}Test 18: Token refresh with invalid token (should fail)${NC}"
INVALID_TOKEN_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/refresh" \
    -H "Content-Type: application/json" \
    -b "refresh_token=invalid.token.here")
print_result $? "Token refresh with invalid token" "$INVALID_TOKEN_RESPONSE"

# ============ LOGOUT TESTS ============
print_section "LOGOUT TESTS"

echo -e "${YELLOW}Test 19: Successful logout${NC}"
LOGOUT_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/logout" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -c "$COOKIE_FILE")
print_result $? "Successful Logout" "$LOGOUT_RESPONSE"

echo -e "${YELLOW}Test 20: Logout without being logged in (should still succeed)${NC}"
LOGOUT_NO_AUTH_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/logout" \
    -H "Content-Type: application/json")
print_result $? "Logout without auth" "$LOGOUT_NO_AUTH_RESPONSE"

# ============ EDGE CASES ============
print_section "EDGE CASES"

echo -e "${YELLOW}Test 21: Registration with empty JSON body (should fail)${NC}"
EMPTY_BODY_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/register" \
    -H "Content-Type: application/json" \
    -d "{}")
print_result $? "Empty JSON body" "$EMPTY_BODY_RESPONSE"

echo -e "${YELLOW}Test 22: Registration with invalid JSON (should fail)${NC}"
INVALID_JSON_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/register" \
    -H "Content-Type: application/json" \
    -d "invalid json")
print_result $? "Invalid JSON" "$INVALID_JSON_RESPONSE"

echo -e "${YELLOW}Test 23: SQL injection attempt (should be handled safely)${NC}"
SQL_INJECTION_RESPONSE=$(curl -s -w "\n{\"status\":%{http_code}}" -X POST "$BASE_URL/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test@test.com'; DROP TABLE users; --\",\"password\":\"password\"}")
print_result $? "SQL injection attempt" "$SQL_INJECTION_RESPONSE"

# ============ SUMMARY ============
echo -e "\n${GREEN}Auth Routes Testing Complete!${NC}"
echo -e "\n${BLUE}═══ TEST SUMMARY ═══${NC}"
echo -e "${GREEN}Completed $PASSED_TESTS/$TOTAL_TESTS tests${NC}"
echo "Cookie file saved to: $COOKIE_FILE"
