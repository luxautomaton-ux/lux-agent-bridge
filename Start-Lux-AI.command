#!/usr/bin/env osascript

-- Lux AI Auto-Start Script for Mac
tell application "Terminal"
    activate
    do script "cd \"$(dirname \"$0\")/lux-agent-bridge\" && npm start"
end tell

delay 2
tell application "Safari"
    activate
    open location "http://localhost:8787"
end tell