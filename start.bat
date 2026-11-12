@echo off
title LootRush demo (localhost)
cd /d "%~dp0"
echo Starting LootRush demo on http://localhost:5500 ...
where python >/dev/null 2>/dev/null && (start "" http://localhost:5500 & python -m http.server 5500 & goto :eof)
where py >/dev/null 2>/dev/null && (start "" http://localhost:5500 & py -m http.server 5500 & goto :eof)
where node >/dev/null 2>/dev/null && (start "" http://localhost:5500 & npx --yes http-server -p 5500 -c-1 & goto :eof)
echo No Python or Node found, opening the page directly instead.
start "" "%~dp0index.html"
pause
