@echo off
setlocal EnableExtensions

title Discord Rich Presence - Setup

:: ==========================================
:: CONFIG
:: ==========================================

set "PROJECT=%~dp0"
set "BASE=https://raw.githubusercontent.com/lifeADMK2/RPC-discord-make/main"
set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

echo.
echo ==========================================
echo       DISCORD RICH PRESENCE SETUP
echo ==========================================
echo.
echo Project folder:
echo %PROJECT%
echo.

:: ==========================================
:: 1. DOWNLOAD PROJECT FILES
:: ==========================================

echo [1/4] Downloading project files...
echo.

curl.exe -L -f "%BASE%/discord-rich-presence-status.js" ^
-o "%PROJECT%discord-rich-presence-status.js"

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to download:
    echo discord-rich-presence-status.js
    pause
    exit /b 1
)

curl.exe -L -f "%BASE%/setting.bat" ^
-o "%PROJECT%setting.bat"

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to download:
    echo setting.bat
    pause
    exit /b 1
)

curl.exe -L -f "%BASE%/discord-rich-presence-startup.vbs" ^
-o "%PROJECT%discord-rich-presence-startup.vbs"

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to download:
    echo discord-rich-presence-startup.vbs
    pause
    exit /b 1
)

echo.
echo [OK] Project files downloaded.
echo.

:: ==========================================
:: 2. CHECK / INSTALL NODE.JS
:: ==========================================

echo [2/4] Checking Node.js...
echo.

where node.exe >nul 2>&1

if not errorlevel 1 (
    echo [OK] Node.js is already installed.
    node --version
    echo.
    goto INSTALL_NPM
)

echo [INFO] Node.js was not found.
echo [INFO] Downloading Node.js...
echo.

set "NODE_INSTALLER=%TEMP%\node-v24.17.0-x64.msi"

curl.exe -L -f ^
"https://nodejs.org/dist/v24.17.0/node-v24.17.0-x64.msi" ^
-o "%NODE_INSTALLER%"

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to download Node.js.
    pause
    exit /b 1
)

echo.
echo Installing Node.js...
echo.

msiexec.exe /i "%NODE_INSTALLER%" /qn /norestart

if errorlevel 1 (
    echo.
    echo [ERROR] Node.js installation failed.
    pause
    exit /b 1
)

del /q "%NODE_INSTALLER%" >nul 2>&1

set "PATH=%ProgramFiles%\nodejs;%PATH%"

echo.
echo [OK] Node.js installed.
echo.

:: ==========================================
:: 3. INSTALL DISCORD-RPC
:: ==========================================

:INSTALL_NPM

echo [3/4] Installing Discord RPC...
echo.

cd /d "%PROJECT%"

if not exist "%PROJECT%package.json" (

    echo Creating package.json...

    (
        echo {
        echo   "dependencies": {
        echo     "discord-rpc": "4.0.1"
        echo   }
        echo }
    ) > "%PROJECT%package.json"
)

echo.
echo Running npm install...
echo.

call npm install

if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)

echo.
echo [OK] Discord RPC installed.
echo.

:: ==========================================
:: 4. COPY VBS TO WINDOWS STARTUP
:: ==========================================

echo [4/4] Setting up Windows Startup...
echo.

if not exist "%STARTUP%" (
    mkdir "%STARTUP%"
)

copy /Y "%PROJECT%discord-rich-presence-startup.vbs" ^
"%STARTUP%\discord-rich-presence-startup.vbs"

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to copy VBS to Startup.
    pause
    exit /b 1
)

echo.
echo [OK] Startup file created:
echo %STARTUP%\discord-rich-presence-startup.vbs
echo.

:: ==========================================
:: COMPLETE
:: ==========================================

echo ==========================================
echo            SETUP COMPLETE
echo ==========================================
echo.

echo Project:
echo %PROJECT%
echo.

echo Files:
echo   discord-rich-presence-status.js
echo   discord-rich-presence-startup.vbs
echo   setting.bat
echo   package.json
echo   package-lock.json
echo   node_modules\
echo.

echo Startup:
echo   discord-rich-presence-startup.vbs
echo.

echo Discord Rich Presence will start
echo automatically when Windows starts.
echo.

:: ==========================================
:: OPEN SETTINGS
:: ==========================================

if exist "%PROJECT%setting.bat" (
    start "" "%PROJECT%setting.bat"
)

call "settings.bat"
exit /b 0
