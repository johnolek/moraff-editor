"""Shared PyGhidra bootstrap: where the Ghidra install, the work directory and
the rebuilt project are.  `export.py` takes its settings from here."""
import os

# The working directory holding the re-laid image and the Ghidra project.
SCRATCH = os.environ.get("MW_WORK", os.getcwd())
os.environ.setdefault("GHIDRA_INSTALL_DIR", "/opt/homebrew/Cellar/ghidra/12.1.3/libexec")
os.environ.setdefault("JAVA_HOME", "/opt/homebrew/Cellar/openjdk@21/21.0.12.1/libexec/openjdk.jdk/Contents/Home")
import pyghidra
pyghidra.start(verbose=False)

PROJ_DIR = SCRATCH
PROJ_NAME = os.environ.get("MW_PROJ", "mwrebuild")
PROGRAM = os.environ.get("MW_BINARY", "world_pages_87.exe")


def open_program(read_only=True):
    from ghidra.base.project import GhidraProject
    project = GhidraProject.openProject(PROJ_DIR, PROJ_NAME, True)
    program = project.openProgram("/", PROGRAM, read_only)
    return project, program
