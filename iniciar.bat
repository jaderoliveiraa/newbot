@echo off
cls
@echo.
@echo    ***********************************************
@echo    ***                                         ***
@echo    ***   INICIANDO O BOT POR FAVOR, AGUARDE!   ***
@echo    ***                                         ***
@echo    ***********************************************
@echo.
start chrome http://localhost:8000/
nodemon jader_bot.js