import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileSystemEvent
from invoke import exceptions
from invoke.tasks import task
import os
import logging


@task
def lint(ctx):
    # Ruff format is not fully implemented
    ctx.run("ruff format **/*.py", pty=True)
    logging.info("Formatting...")
    ctx.run("ruff format .", pty=True)
    logging.info("Linting...")
    ctx.run("ruff check . --fix", pty=True)
    logging.info("Typechecking...")
    ctx.run("pyright .", pty=True)


@task
def shell(ctx):
    ctx.run("bash", pty=True)


@task
def serve_dev(ctx):
    port = os.environ.get("PORT", "8000")
    ctx.run(
        f"uvicorn main:app --reload --host 0.0.0.0 --port {port} --reload-dir . --reload-include '*.md' --http httptools --reload-delay 0.25 --workers 4",
        pty=True,
    )


@task
def serve(ctx):
    port = os.environ.get("PORT", "10000")
    workers = os.environ.get("WORKERS", "4")
    ctx.run(
        f"uvicorn main:app --host 0.0.0.0 --port {port} --workers {workers} --http httptools",
        pty=True,
    )


class PyLintHandler(FileSystemEventHandler):
    def __init__(self, ctx):
        self.ctx = ctx

    def on_modified(self, event: FileSystemEvent):
        if event.src_path.endswith(".py"):  # pyright: ignore
            logging.debug(f"Change detected in {event.src_path}")
            try:
                lint(self.ctx)
            except exceptions.UnexpectedExit:
                logging.debug("Lint Failing")


@task
def watch(ctx):
    handler = PyLintHandler(ctx)
    observer = Observer()
    observer.schedule(handler, path=".", recursive=True)
    observer.start()

    logging.debug("Watching for changes in Python files...")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
