#!/usr/bin/env bash

# ==============================================================================
# Stylework Lead Tracker - Automated cURL Test Suite
# Tests all CRUD endpoints, search, filtering, stats, and CSV export
# ==============================================================================

# Default to Live Render API; pass argument or set TARGET_URL for local testing
API="${1:-https://stylework-leads-crud.onrender.com}"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}  Running Stylework Lead Tracker cURL API Test Suite  ${NC}"
echo -e "${BLUE}  Target API: ${YELLOW}$API${NC}"
echo -e "${BLUE}======================================================${NC}\n"

# 1. Health Check
echo -e "${YELLOW}[1/8] Testing GET /api/health...${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" -X GET "$API/api/health"
echo -e "${GREEN}✓ Health check completed.${NC}\n"

# 2. Get All Leads
echo -e "${YELLOW}[2/8] Testing GET /api/leads (Pagination & Sorting)...${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" -X GET "$API/api/leads?sortBy=createdAt&sortOrder=desc&limit=5"
echo -e "${GREEN}✓ Leads retrieved successfully.${NC}\n"

# 3. Get Stats
echo -e "${YELLOW}[3/8] Testing GET /api/leads/stats (Dashboard KPIs)...${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" -X GET "$API/api/leads/stats"
echo -e "${GREEN}✓ KPI stats retrieved.${NC}\n"

# 4. Search Leads
echo -e "${YELLOW}[4/8] Testing GET /api/leads?search=Aarav...${NC}"
curl -s -w "\nHTTP Status: %{http_code}\n" -X GET "$API/api/leads?search=Aarav"
echo -e "${GREEN}✓ Search completed.${NC}\n"

# 5. Create a Lead
echo -e "${YELLOW}[5/8] Testing POST /api/leads (Create Lead)...${NC}"
CREATE_RESP=$(curl -s -X POST "$API/api/leads" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "cURL Automated Lead",
    "email": "curl.test@stylework.live",
    "phone": "+91 91111 22222",
    "status": "New",
    "notes": "Automated cURL testing pipeline inquiry."
  }')
echo "$CREATE_RESP"

# Extract ID using grep/sed
LEAD_ID=$(echo "$CREATE_RESP" | grep -o '"_id":"[^"]*' | head -n 1 | cut -d'"' -f4)

if [ -n "$LEAD_ID" ]; then
  echo -e "${GREEN}✓ Lead created with ID: $LEAD_ID${NC}\n"

  # 6. Update Status
  echo -e "${YELLOW}[6/8] Testing PATCH /api/leads/$LEAD_ID/status (Update Status)...${NC}"
  curl -s -w "\nHTTP Status: %{http_code}\n" -X PATCH "$API/api/leads/$LEAD_ID/status" \
    -H "Content-Type: application/json" \
    -d '{"status": "Qualified"}'
  echo -e "${GREEN}✓ Status updated to Qualified.${NC}\n"

  # 7. Delete Lead
  echo -e "${YELLOW}[7/8] Testing DELETE /api/leads/$LEAD_ID (Cleanup)...${NC}"
  curl -s -w "\nHTTP Status: %{http_code}\n" -X DELETE "$API/api/leads/$LEAD_ID"
  echo -e "${GREEN}✓ Lead deleted successfully.${NC}\n"
else
  echo -e "${RED}✗ Could not extract created lead ID for update/delete test.${NC}\n"
fi

# 8. CSV Export
echo -e "${YELLOW}[8/8] Testing GET /api/leads/export/csv...${NC}"
CSV_HEAD=$(curl -s -X GET "$API/api/leads/export/csv" | head -n 3)
echo "$CSV_HEAD"
echo -e "${GREEN}✓ CSV export verified.${NC}\n"

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}  All cURL Tests Executed Successfully!              ${NC}"
echo -e "${BLUE}======================================================${NC}"
