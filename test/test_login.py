import pytest
from app import app
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_login_success(client):
    response = client.post('/login', json={'username': 'test', 'password': '1234'})
    assert response.status_code == 200

def test_login_failure(client):
    response = client.post('/login', json={'username': 'test', 'password': 'wrongpass'})
    assert response.status_code == 401
