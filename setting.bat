@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"

title Discord Rich Presence Settings

echo.
echo ==========================================
echo       DISCORD RICH PRESENCE SETTINGS
echo ==========================================
echo.

set /p CLIENT_ID=Nhap Client ID: 
echo.

set /p DETAILS=Nhap Details: 
echo.

set /p STATE=Nhap State: 
echo.

echo.
echo ----- nut' -----
echo.
echo De trong ca 2 neu khong muon co button.
echo.

set /p BUTTON_LABEL=Nhap Button Label: 
echo.

set /p BUTTON_URL=Nhap Button URL: 
echo.

(
    echo {
    echo     "clientId": "%CLIENT_ID%",
    echo     "details": "%DETAILS%",
    echo     "state": "%STATE%",
    echo     "button": {
    echo         "label": "%BUTTON_LABEL%",
    echo         "url": "%BUTTON_URL%"
    echo     }
    echo }
) > "settings.json"

echo.
echo ==========================================
echo          ok luu setting xong roi
echo ==========================================
echo.

type "settings.json"

echo.
echo.
pause
