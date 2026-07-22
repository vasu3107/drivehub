import pytest

def test_list_vehicles(client, customer_headers, sample_vehicles):
    response = client.get("/api/vehicles", headers=customer_headers)
    assert response.status_code == 200
    res_body = response.json()
    assert res_body["success"] is True
    assert len(res_body["data"]) == 3

def test_search_vehicles_by_query(client, customer_headers, sample_vehicles):
    response = client.get("/api/vehicles/search?q=Porsche", headers=customer_headers)
    assert response.status_code == 200
    res_body = response.json()
    assert res_body["success"] is True
    data = res_body["data"]
    assert len(data) == 1
    assert data[0]["make"] == "Porsche"

def test_search_vehicles_by_category_and_price_range(client, customer_headers, sample_vehicles):
    response = client.get("/api/vehicles/search?category=Sports&min_price=100000&max_price=200000", headers=customer_headers)
    assert response.status_code == 200
    res_body = response.json()
    assert res_body["success"] is True
    data = res_body["data"]
    assert len(data) == 1
    assert data[0]["model"] == "911 GT3"

def test_create_vehicle_admin_success(client, admin_headers):
    payload = {
        "make": "Audi",
        "model": "RS e-tron GT",
        "year": 2024,
        "category": "Electric",
        "price": 147100.0,
        "quantity": 2,
        "description": "Electric grand tourer with high speed performance",
        "image_url": "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a"
    }
    response = client.post("/api/vehicles", json=payload, headers=admin_headers)
    assert response.status_code == 201
    res_body = response.json()
    assert res_body["success"] is True
    data = res_body["data"]
    assert data["make"] == "Audi"
    assert data["model"] == "RS e-tron GT"
    assert data["quantity"] == 2

def test_create_vehicle_customer_forbidden(client, customer_headers):
    payload = {
        "make": "Ford",
        "model": "Mustang Dark Horse",
        "year": 2024,
        "category": "Sports",
        "price": 60000.0,
        "quantity": 1
    }
    response = client.post("/api/vehicles", json=payload, headers=customer_headers)
    assert response.status_code == 403
    res_body = response.json()
    assert res_body["success"] is False
    assert "Admin privileges required" in res_body["message"]

def test_update_vehicle_admin(client, admin_headers, sample_vehicles):
    vehicle_id = sample_vehicles[0].id
    update_data = {"price": 179000.0, "quantity": 10}
    response = client.put(f"/api/vehicles/{vehicle_id}", json=update_data, headers=admin_headers)
    assert response.status_code == 200
    res_body = response.json()
    assert res_body["success"] is True
    data = res_body["data"]
    assert data["price"] == 179000.0
    assert data["quantity"] == 10

def test_delete_vehicle_admin(client, admin_headers, sample_vehicles):
    vehicle_id = sample_vehicles[0].id
    response = client.delete(f"/api/vehicles/{vehicle_id}", headers=admin_headers)
    assert response.status_code == 200
    res_body = response.json()
    assert res_body["success"] is True
    assert "deleted successfully" in res_body["message"].lower()

    # Verify deletion
    get_res = client.get(f"/api/vehicles/{vehicle_id}", headers=admin_headers)
    assert get_res.status_code == 404
    assert get_res.json()["success"] is False

def test_delete_vehicle_customer_forbidden(client, customer_headers, sample_vehicles):
    vehicle_id = sample_vehicles[0].id
    response = client.delete(f"/api/vehicles/{vehicle_id}", headers=customer_headers)
    assert response.status_code == 403
    assert response.json()["success"] is False
