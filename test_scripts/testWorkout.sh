#!/bin/bash

# Test Workout Routes Script
# This script tests the workout routes of your fitness app's API
# It depends on prior authentication via the auth routes

# Set the base URLs for the API
AUTH_URL="http://localhost:3001/api/auth"
WORKOUT_URL="http://localhost:3001/api/workouts"
COOKIE_FILE="cookies.txt"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test user credentials
TEST_EMAIL="test@example.com"
TEST_PASSWORD="password123"

# Variables to store IDs
WORKOUT_ID=""
EXERCISE_ID=""
SET_ID=""
SUPERSET_ID=""
SUPERSET_EXERCISE_ID=""
DROPSET_ID=""
SUBSET_ID=""

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

echo "🧪 Testing Workout Routes"
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

# 1. Test Create Workout
print_section "Testing Create Workout"
CREATE_WORKOUT_RESPONSE=$(curl -s -X POST "$WORKOUT_URL/" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"name\":\"Test Workout\",\"notes\":\"Created by test script\"}")

CREATE_WORKOUT_STATUS=$?
echo "$CREATE_WORKOUT_RESPONSE" | jq . 2>/dev/null || echo "$CREATE_WORKOUT_RESPONSE"
print_result $CREATE_WORKOUT_STATUS "Create Workout" "$CREATE_WORKOUT_RESPONSE"

# Extract workout ID
WORKOUT_ID=$(echo "$CREATE_WORKOUT_RESPONSE" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
if [ -n "$WORKOUT_ID" ]; then
    echo "Workout ID: $WORKOUT_ID"
else
    echo -e "${RED}Failed to extract Workout ID. Subsequent tests will fail.${NC}"
    exit 1
fi

# 2. Test Get Workouts List
print_section "Testing Get Workouts List"
WORKOUTS_LIST_RESPONSE=$(curl -s -X GET "$WORKOUT_URL/?limit=10" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")

WORKOUTS_LIST_STATUS=$?
echo "$WORKOUTS_LIST_RESPONSE" | jq . 2>/dev/null || echo "$WORKOUTS_LIST_RESPONSE"
print_result $WORKOUTS_LIST_STATUS "Get Workouts List" "$WORKOUTS_LIST_RESPONSE"

# 3. Test Get Workout by ID
print_section "Testing Get Workout by ID"
GET_WORKOUT_RESPONSE=$(curl -s -X GET "$WORKOUT_URL/$WORKOUT_ID" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")

GET_WORKOUT_STATUS=$?
echo "$GET_WORKOUT_RESPONSE" | jq . 2>/dev/null || echo "$GET_WORKOUT_RESPONSE"
print_result $GET_WORKOUT_STATUS "Get Workout by ID" "$GET_WORKOUT_RESPONSE"

# 4. Test Update Workout
print_section "Testing Update Workout"
UPDATE_WORKOUT_RESPONSE=$(curl -s -X PATCH "$WORKOUT_URL/$WORKOUT_ID" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"name\":\"Updated Test Workout\",\"notes\":\"Updated by test script\"}")

UPDATE_WORKOUT_STATUS=$?
echo "$UPDATE_WORKOUT_RESPONSE" | jq . 2>/dev/null || echo "$UPDATE_WORKOUT_RESPONSE"
print_result $UPDATE_WORKOUT_STATUS "Update Workout" "$UPDATE_WORKOUT_RESPONSE"

# 5. Test Start Workout
print_section "Testing Start Workout"
START_WORKOUT_RESPONSE=$(curl -s -X POST "$WORKOUT_URL/$WORKOUT_ID/start" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")

START_WORKOUT_STATUS=$?
echo "$START_WORKOUT_RESPONSE" | jq . 2>/dev/null || echo "$START_WORKOUT_RESPONSE"
print_result $START_WORKOUT_STATUS "Start Workout" "$START_WORKOUT_RESPONSE"

# 6. Test Add Exercise to Workout
print_section "Testing Add Exercise to Workout"
ADD_EXERCISE_RESPONSE=$(curl -s -X POST "$WORKOUT_URL/$WORKOUT_ID/exercises" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"name\":\"Bench Press\",\"muscleGroup\":\"chest\",\"order\":1,\"notes\":\"Test exercise\"}")

ADD_EXERCISE_STATUS=$?
echo "$ADD_EXERCISE_RESPONSE" | jq . 2>/dev/null || echo "$ADD_EXERCISE_RESPONSE"
print_result $ADD_EXERCISE_STATUS "Add Exercise to Workout" "$ADD_EXERCISE_RESPONSE"

# Extract exercise ID
EXERCISE_ID=$(echo "$ADD_EXERCISE_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
if [ -n "$EXERCISE_ID" ]; then
    echo "Exercise ID: $EXERCISE_ID"
else
    echo -e "${RED}Failed to extract Exercise ID. Subsequent tests will fail.${NC}"
fi

# 7. Test Update Exercise
print_section "Testing Update Exercise"
UPDATE_EXERCISE_RESPONSE=$(curl -s -X PATCH "$WORKOUT_URL/exercises/$EXERCISE_ID" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"name\":\"Incline Bench Press\",\"notes\":\"Updated exercise notes\"}")

UPDATE_EXERCISE_STATUS=$?
echo "$UPDATE_EXERCISE_RESPONSE" | jq . 2>/dev/null || echo "$UPDATE_EXERCISE_RESPONSE"
print_result $UPDATE_EXERCISE_STATUS "Update Exercise" "$UPDATE_EXERCISE_RESPONSE"

# 8. Test Add Set to Exercise
print_section "Testing Add Set to Exercise"
ADD_SET_RESPONSE=$(curl -s -X POST "$WORKOUT_URL/exercises/$EXERCISE_ID/sets" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"weight\":80,\"reps\":10,\"order\":1,\"notes\":\"Warm-up set\"}")

ADD_SET_STATUS=$?
echo "$ADD_SET_RESPONSE" | jq . 2>/dev/null || echo "$ADD_SET_RESPONSE"
print_result $ADD_SET_STATUS "Add Set to Exercise" "$ADD_SET_RESPONSE"

# Extract set ID
SET_ID=$(echo "$ADD_SET_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
if [ -n "$SET_ID" ]; then
    echo "Set ID: $SET_ID"
else
    echo -e "${RED}Failed to extract Set ID. Some tests will fail.${NC}"
fi

# 9. Test Update Set
print_section "Testing Update Set"
UPDATE_SET_RESPONSE=$(curl -s -X PATCH "$WORKOUT_URL/sets/$SET_ID" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"weight\":85,\"reps\":8,\"notes\":\"Working set\"}")

UPDATE_SET_STATUS=$?
echo "$UPDATE_SET_RESPONSE" | jq . 2>/dev/null || echo "$UPDATE_SET_RESPONSE"
print_result $UPDATE_SET_STATUS "Update Set" "$UPDATE_SET_RESPONSE"

# 10. Test Add Dropset to Exercise
print_section "Testing Add Dropset to Exercise"
ADD_DROPSET_RESPONSE=$(curl -s -X POST "$WORKOUT_URL/exercises/$EXERCISE_ID/dropsets" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"order\":2,\"notes\":\"Test dropset\",\"subSets\":[{\"weight\":60,\"reps\":12,\"order\":1},{\"weight\":40,\"reps\":15,\"order\":2}]}")

ADD_DROPSET_STATUS=$?
echo "$ADD_DROPSET_RESPONSE" | jq . 2>/dev/null || echo "$ADD_DROPSET_RESPONSE"
print_result $ADD_DROPSET_STATUS "Add Dropset to Exercise" "$ADD_DROPSET_RESPONSE"

# Extract dropset ID
DROPSET_ID=$(echo "$ADD_DROPSET_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
if [ -n "$DROPSET_ID" ]; then
    echo "Dropset ID: $DROPSET_ID"
else
    echo -e "${RED}Failed to extract Dropset ID. Some tests will fail.${NC}"
fi

# 11. Test Update Dropset
print_section "Testing Update Dropset"
UPDATE_DROPSET_RESPONSE=$(curl -s -X PATCH "$WORKOUT_URL/dropsets/$DROPSET_ID" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"notes\":\"Updated dropset notes\",\"order\":3}")

UPDATE_DROPSET_STATUS=$?
echo "$UPDATE_DROPSET_RESPONSE" | jq . 2>/dev/null || echo "$UPDATE_DROPSET_RESPONSE"
print_result $UPDATE_DROPSET_STATUS "Update Dropset" "$UPDATE_DROPSET_RESPONSE"

# 12. Test Add Subset to Dropset
print_section "Testing Add Subset to Dropset"
ADD_SUBSET_RESPONSE=$(curl -s -X POST "$WORKOUT_URL/dropsets/$DROPSET_ID/subsets" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"weight\":30,\"reps\":20,\"order\":3}")

ADD_SUBSET_STATUS=$?
echo "$ADD_SUBSET_RESPONSE" | jq . 2>/dev/null || echo "$ADD_SUBSET_RESPONSE"
print_result $ADD_SUBSET_STATUS "Add Subset to Dropset" "$ADD_SUBSET_RESPONSE"

# Extract subset ID
SUBSET_ID=$(echo "$ADD_SUBSET_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
if [ -n "$SUBSET_ID" ]; then
    echo "Subset ID: $SUBSET_ID"
else
    echo -e "${RED}Failed to extract Subset ID. Some tests will fail.${NC}"
fi

# 13. Test Update Subset
print_section "Testing Update Subset"
UPDATE_SUBSET_RESPONSE=$(curl -s -X PATCH "$WORKOUT_URL/subsets/$SUBSET_ID" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"weight\":25,\"reps\":25}")

UPDATE_SUBSET_STATUS=$?
echo "$UPDATE_SUBSET_RESPONSE" | jq . 2>/dev/null || echo "$UPDATE_SUBSET_RESPONSE"
print_result $UPDATE_SUBSET_STATUS "Update Subset" "$UPDATE_SUBSET_RESPONSE"

# 14. Test Add Superset to Workout
print_section "Testing Add Superset to Workout"
ADD_SUPERSET_RESPONSE=$(curl -s -X POST "$WORKOUT_URL/$WORKOUT_ID/supersets" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"order\":1,\"notes\":\"Test superset\"}")

ADD_SUPERSET_STATUS=$?
echo "$ADD_SUPERSET_RESPONSE" | jq . 2>/dev/null || echo "$ADD_SUPERSET_RESPONSE"
print_result $ADD_SUPERSET_STATUS "Add Superset to Workout" "$ADD_SUPERSET_RESPONSE"

# Extract superset ID
SUPERSET_ID=$(echo "$ADD_SUPERSET_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
if [ -n "$SUPERSET_ID" ]; then
    echo "Superset ID: $SUPERSET_ID"
else
    echo -e "${RED}Failed to extract Superset ID. Some tests will fail.${NC}"
fi

# 15. Test Update Superset
print_section "Testing Update Superset"
UPDATE_SUPERSET_RESPONSE=$(curl -s -X PATCH "$WORKOUT_URL/supersets/$SUPERSET_ID" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"notes\":\"Updated superset notes\",\"order\":2}")

UPDATE_SUPERSET_STATUS=$?
echo "$UPDATE_SUPERSET_RESPONSE" | jq . 2>/dev/null || echo "$UPDATE_SUPERSET_RESPONSE"
print_result $UPDATE_SUPERSET_STATUS "Update Superset" "$UPDATE_SUPERSET_RESPONSE"

# 16. Test Add Exercise to Superset
print_section "Testing Add Exercise to Superset"
ADD_SUPERSET_EXERCISE_RESPONSE=$(curl -s -X POST "$WORKOUT_URL/supersets/$SUPERSET_ID/exercises" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"name\":\"Tricep Pushdown\",\"muscleGroup\":\"triceps\",\"order\":1,\"notes\":\"First exercise in superset\"}")

ADD_SUPERSET_EXERCISE_STATUS=$?
echo "$ADD_SUPERSET_EXERCISE_RESPONSE" | jq . 2>/dev/null || echo "$ADD_SUPERSET_EXERCISE_RESPONSE"
print_result $ADD_SUPERSET_EXERCISE_STATUS "Add Exercise to Superset" "$ADD_SUPERSET_EXERCISE_RESPONSE"

# Extract superset exercise ID
SUPERSET_EXERCISE_ID=$(echo "$ADD_SUPERSET_EXERCISE_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
if [ -n "$SUPERSET_EXERCISE_ID" ]; then
    echo "Superset Exercise ID: $SUPERSET_EXERCISE_ID"
else
    echo -e "${RED}Failed to extract Superset Exercise ID. Some tests will fail.${NC}"
fi

# 17. Test Add Another Exercise to Superset
print_section "Testing Add Second Exercise to Superset"
ADD_SUPERSET_EXERCISE2_RESPONSE=$(curl -s -X POST "$WORKOUT_URL/supersets/$SUPERSET_ID/exercises" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE" \
    -d "{\"name\":\"Bicep Curl\",\"muscleGroup\":\"biceps\",\"order\":2,\"notes\":\"Second exercise in superset\"}")

ADD_SUPERSET_EXERCISE2_STATUS=$?
echo "$ADD_SUPERSET_EXERCISE2_RESPONSE" | jq . 2>/dev/null || echo "$ADD_SUPERSET_EXERCISE2_RESPONSE"
print_result $ADD_SUPERSET_EXERCISE2_STATUS "Add Second Exercise to Superset" "$ADD_SUPERSET_EXERCISE2_RESPONSE"

# 18. Test End Workout
print_section "Testing End Workout"
END_WORKOUT_RESPONSE=$(curl -s -X POST "$WORKOUT_URL/$WORKOUT_ID/end" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")

END_WORKOUT_STATUS=$?
echo "$END_WORKOUT_RESPONSE" | jq . 2>/dev/null || echo "$END_WORKOUT_RESPONSE"
print_result $END_WORKOUT_STATUS "End Workout" "$END_WORKOUT_RESPONSE"

# 19. Test Get Updated Workout after adding exercises and sets
print_section "Testing Get Updated Workout Details"
GET_UPDATED_WORKOUT_RESPONSE=$(curl -s -X GET "$WORKOUT_URL/$WORKOUT_ID" \
    -H "Content-Type: application/json" \
    -b "$COOKIE_FILE")

GET_UPDATED_WORKOUT_STATUS=$?
echo "$GET_UPDATED_WORKOUT_RESPONSE" | jq . 2>/dev/null || echo "$GET_UPDATED_WORKOUT_RESPONSE"
print_result $GET_UPDATED_WORKOUT_STATUS "Get Updated Workout Details" "$GET_UPDATED_WORKOUT_RESPONSE"

# 20. Test Delete Operations (in reverse order)
# This section is commented out to preserve the created workout for manual inspection
# Uncomment if you want to test deletion as well

print_section "Testing Delete Operations"

# Delete Subset
if [ -n "$SUBSET_ID" ]; then
    echo -e "${YELLOW}Deleting Subset...${NC}"
    DELETE_SUBSET_RESPONSE=$(curl -s -X DELETE "$WORKOUT_URL/subsets/$SUBSET_ID" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_FILE")
    
    DELETE_SUBSET_STATUS=$?
    echo "$DELETE_SUBSET_RESPONSE" | jq . 2>/dev/null || echo "$DELETE_SUBSET_RESPONSE"
    print_result $DELETE_SUBSET_STATUS "Delete Subset" "$DELETE_SUBSET_RESPONSE"
fi

# Delete Dropset
if [ -n "$DROPSET_ID" ]; then
    echo -e "${YELLOW}Deleting Dropset...${NC}"
    DELETE_DROPSET_RESPONSE=$(curl -s -X DELETE "$WORKOUT_URL/dropsets/$DROPSET_ID" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_FILE")
    
    DELETE_DROPSET_STATUS=$?
    echo "$DELETE_DROPSET_RESPONSE" | jq . 2>/dev/null || echo "$DELETE_DROPSET_RESPONSE"
    print_result $DELETE_DROPSET_STATUS "Delete Dropset" "$DELETE_DROPSET_RESPONSE"
fi

# Delete Set
if [ -n "$SET_ID" ]; then
    echo -e "${YELLOW}Deleting Set...${NC}"
    DELETE_SET_RESPONSE=$(curl -s -X DELETE "$WORKOUT_URL/sets/$SET_ID" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_FILE")
    
    DELETE_SET_STATUS=$?
    echo "$DELETE_SET_RESPONSE" | jq . 2>/dev/null || echo "$DELETE_SET_RESPONSE"
    print_result $DELETE_SET_STATUS "Delete Set" "$DELETE_SET_RESPONSE"
fi

# Remove Exercise from Superset
if [ -n "$SUPERSET_ID" ] && [ -n "$SUPERSET_EXERCISE_ID" ]; then
    echo -e "${YELLOW}Removing Exercise from Superset...${NC}"
    REMOVE_SUPERSET_EXERCISE_RESPONSE=$(curl -s -X DELETE "$WORKOUT_URL/supersets/$SUPERSET_ID/exercises/$SUPERSET_EXERCISE_ID" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_FILE")
    
    REMOVE_SUPERSET_EXERCISE_STATUS=$?
    echo "$REMOVE_SUPERSET_EXERCISE_RESPONSE" | jq . 2>/dev/null || echo "$REMOVE_SUPERSET_EXERCISE_RESPONSE"
    print_result $REMOVE_SUPERSET_EXERCISE_STATUS "Remove Exercise from Superset" "$REMOVE_SUPERSET_EXERCISE_RESPONSE"
fi

# Delete Superset
if [ -n "$SUPERSET_ID" ]; then
    echo -e "${YELLOW}Deleting Superset...${NC}"
    DELETE_SUPERSET_RESPONSE=$(curl -s -X DELETE "$WORKOUT_URL/supersets/$SUPERSET_ID" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_FILE")
    
    DELETE_SUPERSET_STATUS=$?
    echo "$DELETE_SUPERSET_RESPONSE" | jq . 2>/dev/null || echo "$DELETE_SUPERSET_RESPONSE"
    print_result $DELETE_SUPERSET_STATUS "Delete Superset" "$DELETE_SUPERSET_RESPONSE"
fi

# Delete Exercise
if [ -n "$EXERCISE_ID" ]; then
    echo -e "${YELLOW}Deleting Exercise...${NC}"
    DELETE_EXERCISE_RESPONSE=$(curl -s -X DELETE "$WORKOUT_URL/exercises/$EXERCISE_ID" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_FILE")
    
    DELETE_EXERCISE_STATUS=$?
    echo "$DELETE_EXERCISE_RESPONSE" | jq . 2>/dev/null || echo "$DELETE_EXERCISE_RESPONSE"
    print_result $DELETE_EXERCISE_STATUS "Delete Exercise" "$DELETE_EXERCISE_RESPONSE"
fi

# Delete Workout
if [ -n "$WORKOUT_ID" ]; then
    echo -e "${YELLOW}Deleting Workout...${NC}"
    DELETE_WORKOUT_RESPONSE=$(curl -s -X DELETE "$WORKOUT_URL/$WORKOUT_ID" \
        -H "Content-Type: application/json" \
        -b "$COOKIE_FILE")
    
    DELETE_WORKOUT_STATUS=$?
    echo "$DELETE_WORKOUT_RESPONSE" | jq . 2>/dev/null || echo "$DELETE_WORKOUT_RESPONSE"
    print_result $DELETE_WORKOUT_STATUS "Delete Workout" "$DELETE_WORKOUT_RESPONSE"
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

echo -e "\n${GREEN}Workout Routes Testing Complete!${NC}"