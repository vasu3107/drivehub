import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.database import Base, get_db
import app.models  # Ensure all models are loaded
from app.main import app
from app.models.user import User
from app.models.vehicle import Vehicle
from app.core.security import get_password_hash, create_access_token

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def _get_test_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _get_test_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def test_admin_user(db_session):
    admin = User(
        username="admin_test",
        email="admin@drivehub.com",
        hashed_password=get_password_hash("AdminPass123!"),
        role="admin"
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin

@pytest.fixture
def test_customer_user(db_session):
    customer = User(
        username="customer_test",
        email="customer@drivehub.com",
        hashed_password=get_password_hash("CustomerPass123!"),
        role="customer"
    )
    db_session.add(customer)
    db_session.commit()
    db_session.refresh(customer)
    return customer

@pytest.fixture
def admin_headers(test_admin_user):
    token = create_access_token({"sub": test_admin_user.username, "role": test_admin_user.role})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def customer_headers(test_customer_user):
    token = create_access_token({"sub": test_customer_user.username, "role": test_customer_user.role})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def sample_vehicles(db_session):
    v1 = Vehicle(
        make="Porsche",
        model="911 GT3",
        year=2024,
        category="Sports",
        price=182900.0,
        quantity=3,
        description="High performance sports car",
        image_url="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e"
    )
    v2 = Vehicle(
        make="Tesla",
        model="Model S Plaid",
        year=2024,
        category="Electric",
        price=89990.0,
        quantity=0,  # Out of stock for testing purchase error
        description="Tri-motor all-wheel drive electric luxury sedan",
        image_url="https://images.unsplash.com/photo-1560958089-b8a1929cea89"
    )
    v3 = Vehicle(
        make="BMW",
        model="X5 M Competition",
        year=2023,
        category="SUV",
        price=122300.0,
        quantity=5,
        description="Luxury high performance SUV",
        image_url="https://images.unsplash.com/photo-1555215695-3004980ad54e"
    )
    db_session.add_all([v1, v2, v3])
    db_session.commit()
    return [v1, v2, v3]
