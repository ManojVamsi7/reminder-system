#!/bin/bash
# Quick Test Script - Run this to test the system

echo "🧪 Testing Subscription Renewal Reminder System..."
echo ""

# Test 1: Health Check
echo "1️⃣ Testing Health Endpoint..."
curl -s http://localhost:3000/health | jq . || curl -s http://localhost:3000/health
echo ""
echo ""

# Test 2: Trigger Cron Job
echo "2️⃣ Triggering Cron Job Manually..."
echo "This will:"
echo "  - Read clients from Google Sheet"
echo "  - Check eligibility (Active, Paid, expiry in 5 days)"
echo "  - Send emails to eligible clients"
echo "  - Update the sheet"
echo ""

curl -X POST http://localhost:3000/admin/trigger-cron \
  -H "x-api-key: a7f3e9d2c1b4a8f6e5d3c2b1a9f8e7d6c5b4a3f2e1d9c8b7a6f5e4d3c2b1a0f9" \
  -H "Content-Type: application/json"

echo ""
echo ""
echo "✅ Test complete!"
echo ""
echo "📋 What to check:"
echo "  1. Terminal where 'npm run dev' is running - look for cron job logs"
echo "  2. Your Google Sheet - check if columns I, J, K, L are updated"
echo "  3. Email inbox - check for renewal reminder emails"
echo ""
