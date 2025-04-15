import requests
import json
from datetime import datetime, timedelta
import random
import pytest # Added import

BASE_URL = "http://localhost:5000/api"

# --- Helper Functions (Unchanged) ---
def login():
    """Login and get access token"""
    print("\n=== Logging in ===")
    # Assuming the API is running and accessible during the test
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json={
            "email": "layla.hassan@example.com", # Ensure this user exists in the test environment
            "password": "password123"
        }, timeout=10) # Added timeout
        response.raise_for_status() # Raise an exception for bad status codes
        data = response.json()
        token = data.get('access_token')
        if not token:
            pytest.fail("Failed to retrieve access token during login.")
        return token
    except requests.exceptions.RequestException as e:
        pytest.fail(f"Login request failed: {e}")

def add_test_bills(access_token):
    """Add some test bills with different categories and dates"""
    print("\n=== Adding test bills ===")
    categories = ['Groceries', 'Utilities', 'Entertainment', 'Transportation']
    today = datetime.now()

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    # Add bills for the last 60 days
    for i in range(60):
        date = today - timedelta(days=i)
        category = random.choice(categories)
        amount = random.randint(10, 200)

        bill_data = {
            "category": category,
            "amount": amount,
            "due_date": date.strftime("%Y-%m-%d"),
            "description": f"Test bill for {category}"
        }

        try:
            response = requests.post(
                f"{BASE_URL}/bills/add",
                headers=headers,
                json=bill_data,
                timeout=5 # Added timeout
            )
            # Optionally check response status if needed, but focus is on analytics test
            if response.status_code != 200:
                 # Log warning instead of failing the test if bill adding isn't critical
                 print(f"Warning: Failed to add bill (status {response.status_code}): {response.text}")
        except requests.exceptions.RequestException as e:
             print(f"Warning: Request to add bill failed: {e}")


# --- Pytest Fixture ---
@pytest.fixture(scope="module")
def access_token():
    """Pytest fixture to log in and provide access token."""
    print("Setting up access_token fixture (module scope)")
    token = login()
    return token

# --- Test Function ---
def test_spending_analytics(access_token): # Now uses the fixture
    """Test the spending analytics endpoint"""
    print("\n=== Setting up data for spending analytics test ===")
    # Add test data needed specifically for this test
    add_test_bills(access_token)

    print("\n=== Testing spending analytics ===")
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    # Test for different periods
    periods = ['week', 'month', 'year']
    failures = []
    for period in periods:
        print(f"\nTesting {period} period:")
        try:
            response = requests.get(
                f"{BASE_URL}/analytics/spending?period={period}",
                headers=headers,
                timeout=10 # Added timeout
            )
            print(f"Status Code: {response.status_code}")
            print("Response:")
            print(json.dumps(response.json(), indent=2))
            # Add assertion: Check for successful status code
            if response.status_code != 200:
                failures.append(f"Period '{period}' failed with status {response.status_code}: {response.text}")
            # Optional: Add more specific assertions about the response content
            # assert 'some_key' in response.json(), f"Expected key not found for period {period}"

        except requests.exceptions.RequestException as e:
            failures.append(f"Request for period '{period}' failed: {e}")
        except json.JSONDecodeError as e:
             failures.append(f"Failed to decode JSON response for period '{period}': {e}")

    # Assert that there were no failures during the test runs
    assert not failures, "Failures occurred during spending analytics test:\n" + "\n".join(failures)


# Removed the if __name__ == "__main__": block as pytest handles test discovery and execution.
