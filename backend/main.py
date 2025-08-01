import sqlite3
from fastapi import FastAPI, Request
from starlette.responses import FileResponse
import logging
import time
from config import check_env_vars
from protein_folding.routers import router as protein_folding_router

# Initialize environment variables
env = check_env_vars()

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    logger.info(f"Incoming Request: Method={request.method}, URL={request.url}")

    response = await call_next(request)

    process_time = time.time() - start_time
    logger.info(
        f"Outgoing Response: Status={response.status_code}, ProcessTime={process_time:.4f}s"
    )
    return response


# Include routers
app.include_router(protein_folding_router, prefix="/api/v1")


@app.get("/")
@app.get("/app/{full_path:path}")
async def read_app():
    return FileResponse("static/index.html")


# anytime we get /assets/*, we want to serve the static files in the assets folder
# used in prod to serve react build
@app.get("/assets/{file_path}")
def static_assets(file_path: str):
    return FileResponse(f"static/assets/{file_path}")


# anytime we get /images/*, we want to serve the static files in the assets folder
# used in prod to serve react build
@app.get("/images/{file_path}")
def static_images(file_path: str):
    return FileResponse(f"static/images/{file_path}")


@app.get("/favicon.ico")
def favicon():
    return FileResponse("static/favicon.ico")


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
