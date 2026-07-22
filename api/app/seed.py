from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.vehicle import Vehicle
from app.core.security import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if admin already exists
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin = User(
            username="admin",
            email="admin@drivehub.com",
            hashed_password=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin)
        print("Created demo admin user: admin / admin123")

    customer = db.query(User).filter(User.username == "customer").first()
    if not customer:
        customer = User(
            username="customer",
            email="customer@drivehub.com",
            hashed_password=get_password_hash("customer123"),
            role="customer"
        )
        db.add(customer)
        print("Created demo customer user: customer / customer123")

    # Seed vehicles if table is empty
    if db.query(Vehicle).count() == 0:
        demo_vehicles = [
            Vehicle(
                make="Porsche",
                model="911 GT3 RS",
                year=2024,
                category="Sports",
                price=241300.0,
                quantity=2,
                description="Naturally aspirated 4.0-liter flat-six producing 518 hp with extreme aerodynamic downforce.",
                image_url="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"
            ),
            Vehicle(
                make="Tesla",
                model="Cybertruck Cyberbeast",
                year=2024,
                category="Electric",
                price=99990.0,
                quantity=1,
                description="845 hp tri-motor AWD electric truck with stainless steel exoskeleton and armor glass.",
                image_url="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80"
            ),
            Vehicle(
                make="BMW",
                model="M4 CSL",
                year=2023,
                category="Sports",
                price=140800.0,
                quantity=0,  # Out of stock example
                description="Ultra-lightweight track focused coupe, 543 hp twin-turbo inline 6.",
                image_url="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
            ),
            Vehicle(
                make="Mercedes-AMG",
                model="G 63 Grand Edition",
                year=2024,
                category="SUV",
                price=183000.0,
                quantity=4,
                description="Handcrafted AMG 4.0L V8 biturbo engine with iconic G-Class luxury styling.",
                image_url="https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80"
            ),
            Vehicle(
                make="Lucid",
                model="Air Sapphire",
                year=2024,
                category="Electric",
                price=249000.0,
                quantity=3,
                description="Sub-2 second 0-60 mph mega-sedan with 1,234 hp and 427 miles EPA range.",
                image_url="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
            ),
            Vehicle(
                make="Rolls-Royce",
                model="Spectre",
                year=2024,
                category="Luxury",
                price=422750.0,
                quantity=1,
                description="The world's premier ultra-luxury electric super coupe with starlight headliner.",
                image_url="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80"
            )
        ]
        db.add_all(demo_vehicles)
        print(f"Seeded {len(demo_vehicles)} vehicles into database.")

    db.commit()
    db.close()
    print("Database seeding completed!")

if __name__ == "__main__":
    seed_database()
