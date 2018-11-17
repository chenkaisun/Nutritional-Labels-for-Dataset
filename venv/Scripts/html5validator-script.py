#!D:\p3\venv\Scripts\python.exe
# EASY-INSTALL-ENTRY-SCRIPT: 'html5validator==0.2.8','console_scripts','html5validator'
__requires__ = 'html5validator==0.2.8'
import re
import sys
from pkg_resources import load_entry_point

if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw?|\.exe)?$', '', sys.argv[0])
    sys.exit(
        load_entry_point('html5validator==0.2.8', 'console_scripts', 'html5validator')()
    )
