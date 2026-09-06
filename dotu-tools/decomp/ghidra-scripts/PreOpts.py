# Disable analyzers that misfire on Borland 16-bit code
# @category Setup
from ghidra.program.model.listing import Program
opts = ["Non-Returning Functions - Discovered", "Non-Returning Functions - Known"]
for o in opts:
    try:
        setAnalysisOption(currentProgram, o, "false")
        print("disabled", o)
    except Exception as e:
        print("could not set", o, e)
