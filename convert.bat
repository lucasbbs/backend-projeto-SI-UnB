@ECHO OFF
SETLOCAL
SET "sourcedir=./DIR"
PUSHD "%sourcedir%"
FOR /f "delims=" %%a IN (
 'dir /b /s /a-d *.md'
 ) DO (
 IF /i "%%~xa"==".md" (
  REM IF NOT EXIST "%%~dpna.html" 
  pandoc "%%a" --self-contained -f markdown -t  html -o "%%~dpna.html"
  REM pandoc -f markdown -s "%%a"  -o "%%~dpna.rtf"
 ) 
)
popd
GOTO :EOF