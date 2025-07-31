import sqlite3
from fastapi import FastAPI
from starlette.responses import FileResponse

from config import check_env_vars
from protein_folding.routers import router as protein_folding_router

# Initialize environment variables
env = check_env_vars()

app = FastAPI()

# Include routers
app.include_router(protein_folding_router, prefix="/api/v1")


@app.get("/")
async def read_index():
    return FileResponse("static/index.html")


@app.get("/app/{full_path:path}")
async def read_app():
    return FileResponse("static/index.html")


@app.get("/favicon.ico")
def favicon():
    return FileResponse("/usr/src/app/static/images/favicon.ico")


@app.get("/assets/{file_path}")
def static_assets(file_path: str):
    return FileResponse(f"/usr/src/app/static/assets/{file_path}")


@app.get("/images/{file_path}")
def static_images(file_path: str):
    return FileResponse(f"/usr/src/app/static/images/{file_path}")


@app.get("/api/users")
async def fetch_users():
    # get users from db
    conn = get_db_connection()
    with conn:
        users = conn.execute("SELECT * FROM Users").fetchall()
        return {"users": users}


conn = None


def get_db_connection():
    global conn
    if conn is None:
        conn = sqlite3.connect("database.db")
    return conn


def setup_dev_db():
    conn = get_db_connection()
    with conn:
        conn.execute(
            """
                CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE
            )
        """
        )

        # Insert dummy data
        users = [
            ("Alice", "alice@example.com"),
            ("Bob", "bob@example.com"),
            ("Charlie", "charlie@example.com"),
        ]

        conn.executemany(
            "INSERT OR IGNORE INTO Users (name, email) VALUES (?, ?)", users
        )
    print("Dev Database setup completed")


setup_dev_db()
