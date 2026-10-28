#!/bin/bash
# Double-click this file to start the FinVenture local server
cd "$(dirname "$0")"
echo "Starting FinVenture server at http://localhost:8080"
echo "Press Ctrl+C to stop"
open "http://localhost:8080/index.html"
python3 -m http.server 8080
