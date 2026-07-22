import pytest

def test_user_registration_success(client):
    response = client.post("/api/auth/register", json={
        "username": "newdriver",
        "email": "newdriver@example.com",
        "password": "Password123!",
        "role": "customer"
    })
    assert response.status_code == 201
    res_body = response.json()
    assert res_body["success"] is True
    assert res_body["status_code"] == 201
    data = res_body["data"]
    assert data["username"] == "newdriver"
    assert data["email"] == "newdriver@example.com"
    assert data["role"] == "customer"
    assert "id" in data

def test_user_registration_duplicate_username(client, test_customer_user):
    response = client.post("/api/auth/register", json={
        "username": test_customer_user.username,
        "email": "another@example.com",
        "password": "Password123!",
        "role": "customer"
    })
    assert response.status_code == 400
    res_body = response.json()
    assert res_body["success"] is False
    assert res_body["status_code"] == 400
    assert "Username already registered" in res_body["message"]

def test_user_login_success(client, test_customer_user):
    response = client.post("/api/auth/login", json={
        "username_or_email": test_customer_user.username,
        "password": "CustomerPass123!"
    })
    assert response.status_code == 200
    res_body = response.json()
    assert res_body["success"] is True
    data = res_body["data"]
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["username"] == test_customer_user.username

def test_user_login_with_email(client, test_customer_user):
    response = client.post("/api/auth/login", json={
        "username_or_email": test_customer_user.email,
        "password": "CustomerPass123!"
    })
    assert response.status_code == 200
    res_body = response.json()
    assert res_body["success"] is True
    assert "access_token" in res_body["data"]

def test_user_login_invalid_password(client, test_customer_user):
    response = client.post("/api/auth/login", json={
        "username_or_email": test_customer_user.username,
        "password": "WrongPassword!"
    })
    assert response.status_code == 401
    res_body = response.json()
    assert res_body["success"] is False
    assert "Invalid credentials" in res_body["message"]

def test_get_current_user_me(client, customer_headers, test_customer_user):
    response = client.get("/api/auth/me", headers=customer_headers)
    assert response.status_code == 200
    res_body = response.json()
    assert res_body["success"] is True
    data = res_body["data"]
    assert data["username"] == test_customer_user.username
    assert data["email"] == test_customer_user.email
