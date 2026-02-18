import shutil
import os
from pathlib import Path

# Source and destination paths
SOURCE_DIR = Path(r"C:\Users\emili\Downloads\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max")
DEST_DIR = Path(r".skill")

def copy_skill():
    if DEST_DIR.exists():
        shutil.rmtree(DEST_DIR)
    
    # Copy scripts
    scripts_src = SOURCE_DIR / "scripts"
    scripts_dest = DEST_DIR / "scripts"
    shutil.copytree(scripts_src, scripts_dest)
    print(f"Copied scripts to {scripts_dest}")

    # Copy data
    data_src = SOURCE_DIR / "data"
    data_dest = DEST_DIR / "data"
    shutil.copytree(data_src, data_dest)
    print(f"Copied data to {data_dest}")

if __name__ == "__main__":
    copy_skill()
