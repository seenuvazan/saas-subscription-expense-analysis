@IF "%MAVEN_BATCH_ECHO%" == "on"  echo %MAVEN_BATCH_ECHO%
@IF NOT "%MAVEN_BATCH_ECHO%" == "on"  @echo off

@setlocal

set ERROR_CODE=0
set MAVEN_MAIN_CLASS=org.apache.maven.wrapper.MavenWrapperMain
set MAVEN_PROJECTBASEDIR=%~dp0

if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

if not "%JAVA_HOME%" == "" goto CheckJHome

where java >nul 2>nul
if %ERRORLEVEL% equ 0 (
    set JAVACMD=java
    goto init
)

echo.
echo ERROR: JAVA_HOME is not set and 'java' executable was not found in PATH.
echo Please install Java JDK 17+ and set JAVA_HOME.
echo.
goto error

:CheckJHome
set JAVACMD="%JAVA_HOME%\bin\java.exe"
if exist %JAVACMD% goto init

where java >nul 2>nul
if %ERRORLEVEL% equ 0 (
    set JAVACMD=java
    goto init
)

echo.
echo ERROR: JAVA_HOME is set to an invalid path: "%JAVA_HOME%"
echo Cannot find java.exe at "%JAVA_HOME%\bin\java.exe".
echo Please update your JAVA_HOME environment variable to point to a valid JDK directory.
echo.
goto error

:init
set WRAPPER_JAR_PATH=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar

if exist "%WRAPPER_JAR_PATH%" goto run

echo Downloading Maven Wrapper JAR...

set PS_EXE=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe
if exist "%PS_EXE%" (
    "%PS_EXE%" -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar', '%WRAPPER_JAR_PATH%')"
    goto run
)

where curl >nul 2>nul
if %ERRORLEVEL% equ 0 (
    curl -s -S -L -o "%WRAPPER_JAR_PATH%" https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar
    goto run
)

echo ERROR: Unable to download maven-wrapper.jar automatically.
goto error

:run
%JAVACMD% %MAVEN_OPTS% -classpath "%WRAPPER_JAR_PATH%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %MAVEN_MAIN_CLASS% %*
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_STATUS=%ERROR_CODE%
if %ERROR_STATUS%==0 exit /b 0
exit /b %ERROR_STATUS%
