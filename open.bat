@echo off  
start cmd /k "fis3 server start --type jello -p 9000&&fis3 release -w -c"  
start cmd /k "fis3 release -w -f fis-dev-conf.js"  