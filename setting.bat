 @echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"

title Discord Rich Presence Settings

echo.
echo ==========================================
echo                SETTINGS
echo ==========================================
echo.

set /p CLIENT_ID=Nhap Client ID: 
echo.

set /p DETAILS=Nhap Details(tu` 2 chu~ tro? len): 
echo.

set /p STATE=Nhap State(tu` 2 chu~ tro? len): 
echo.

echo.
echo ----- button 1 -----
echo De trong ca 2 neu khong muon co button.
echo.

set /p BUTTON_LABEL=Nhap Button 1 Label: 
echo.

set /p BUTTON_URL=Nhap Button 1 URL: 
echo.

echo.
echo ----- button 2 -----
echo De trong ca 2 neu khong muon co button.
echo.

set /p BUTTON2_LABEL=Nhap Button 2 Label: 
echo.

set /p BUTTON2_URL=Nhap Button 2 URL: 
echo.

(
    echo {
    echo     "clientId": "%CLIENT_ID%",
    echo     "details": "%DETAILS%",
    echo     "state": "%STATE%",
    echo     "buttons": [
    echo         {
    echo             "label": "%BUTTON_LABEL%",
    echo             "url": "%BUTTON_URL%"
    echo         },
    echo         {
    echo             "label": "%BUTTON2_LABEL%",
    echo             "url": "%BUTTON2_URL%"
    echo         }
    echo     ]
    echo }
) > "settings.json"

echo.
echo ==========================================
echo          OK LUU SETTING XONG ROI
echo ==========================================
echo.

type "settings.json"

echo.
echo.
exit
