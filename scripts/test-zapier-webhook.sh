#!/bin/bash

echo "Testing Zapier webhook endpoint..."
echo "=================================="
echo ""

# Test data for a new client
curl -X POST http://localhost:3000/api/zapier/client \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "test-client-'$(date +%s)'",
    "businessName": "Test Company Inc",
    "clientFullName": "John Test",
    "email": "john@testcompany.com",
    "sprintType": "One screen/flow to ship",
    "oneSentenceOutcome": "Build a new user dashboard",
    "timezone": "America/New_York"
  }'

echo ""
echo ""
echo "=================================="
echo "Webhook test complete!"
echo ""
echo "Check the following:"
echo "1. Visit http://localhost:3000/admin to see the new task in the sidebar"
echo "2. The client should appear in the Lead column of the pipeline"
echo "3. A 'Review and approve onboarding form' task should be created"
