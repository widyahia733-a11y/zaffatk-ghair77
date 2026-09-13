@echo off
chcp 65001 > nul
echo ====================================================
echo   تشغيل منصة زفتك غير (ZaffatakGhair)
echo   جاري فتح الموقع في المتصفح...
echo ====================================================
start http://localhost:8080
python -m http.server 8080
pause
