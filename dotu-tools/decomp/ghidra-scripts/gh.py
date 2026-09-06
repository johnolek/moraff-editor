import os
# The working directory holding unf_pages.exe and the Ghidra project.
SCRATCH = os.environ.get("UNF_WORK", os.getcwd())
os.environ.setdefault("GHIDRA_INSTALL_DIR", "/opt/homebrew/Cellar/ghidra/12.1.3/libexec")
os.environ.setdefault("JAVA_HOME", "/opt/homebrew/Cellar/openjdk@21/21.0.12.1/libexec/openjdk.jdk/Contents/Home")
import pyghidra
pyghidra.start(verbose=False)

PROJ_DIR = SCRATCH
PROJ_NAME = os.environ.get("UNF_PROJ", "unfrebuild")
PROGRAM = "unf_pages.exe"

FAILED = ["2000:0a06","2000:0bc3","2000:0d83","2000:11ea","2000:1392",
          "2000:2a83","2000:2ecc","2000:438f","2000:b782","2000:df3e",
          "3000:d904","4000:5a62"]

def open_program(read_only=True):
    from ghidra.base.project import GhidraProject
    project = GhidraProject.openProject(PROJ_DIR, PROJ_NAME, True)
    program = project.openProgram("/", PROGRAM, read_only)
    return project, program
