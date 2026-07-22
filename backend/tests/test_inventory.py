import pytest

def test_purchase_vehicle_success(client, customer_headers, sample_vehicles):
    vehicle = sample_vehicles[0]  # Porsche with qty 3
    initial_qty = vehicle.quantity

    response = client.post(f"/api/vehicles/{vehicle.id}/purchase", headers=customer_headers)
    assert response.status_code == 200
    res_body = response.json()
    assert res_body["success"] is True
    data = res_body["data"]
    assert data["quantity"] == initial_qty - 1
    assert "successfully purchased" in res_body["message"].lower()

def test_purchase_vehicle_out_of_stock(client, customer_headers, sample_vehicles):
    vehicle = sample_vehicles[1]  # Tesla with qty 0

    response = client.post(f"/api/vehicles/{vehicle.id}/purchase", headers=customer_headers)
    assert response.status_code == 400
    res_body = response.json()
    assert res_body["success"] is False
    assert "Out of stock" in res_body["message"]

def test_restock_vehicle_admin_success(client, admin_headers, sample_vehicles):
    vehicle = sample_vehicles[1]  # Tesla with qty 0

    response = client.post(
        f"/api/vehicles/{vehicle.id}/restock",
        json={"quantity": 5},
        headers=admin_headers
    )
    assert response.status_code == 200
    res_body = response.json()
    assert res_body["success"] is True
    data = res_body["data"]
    assert data["quantity"] == 5
    assert "restocked successfully" in res_body["message"].lower()

def test_restock_vehicle_customer_forbidden(client, customer_headers, sample_vehicles):
    vehicle = sample_vehicles[0]

    response = client.post(
        f"/api/vehicles/{vehicle.id}/restock",
        json={"quantity": 5},
        headers=customer_headers
    )
    assert response.status_code == 403
    res_body = response.json()
    assert res_body["success"] is False
    assert "Admin privileges required" in res_body["message"]
