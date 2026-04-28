# BREAKIN Web Player - build commands

# Build the .jsdos bundle from source game files + dosbox config
bundle:
    #!/usr/bin/env bash
    set -euo pipefail
    cd src/breakin-files
    mkdir -p .jsdos
    cp ../dosbox.conf .jsdos/dosbox.conf
    zip -r ../../build/breakanoid.jsdos . -x '.*' -x '.jsdos/'
    zip -r ../../build/breakanoid.jsdos .jsdos/
    rm -rf .jsdos
    echo "Built build/breakanoid.jsdos"

# Serve the site locally
serve:
    cd build && python3 -m http.server 8080 --bind 127.0.0.1

# Serve and open in browser
dev:
    open http://localhost:8080
    cd build && python3 -m http.server 8080 --bind 127.0.0.1
