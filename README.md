# utb - University Telegram Bot

### Description
TODO
### Technologies
* ubuntu 18.04
* node.js version >= 10.16
* mongodb = 4.2
### Architecture
TODO
### Structure of code
* overlord - bash scripts and files to build, run, test project components
* libs - shared code or code for specific things  
IMPORTANT - libs don't support versions, so you can't make  not backward-compatible changes
    * logger - log important events
    * metrics - collect metrics to get in mind how system is used
    * domain-model - MongoDB interface
    * xlsx-parser - parse data in xlsx format
* components - components of the utb system
    * api - API for admin UI
    * telegram-handler - app responsible for handling telegram bot
    * ui - Web app for admins
### Change log
* v1.0.0
    * telegram bot: lesson schedule 
    * telegram bot: calls schedule 
    * telegram bot: current week 
    * telegram bot: current / next lesson 
    * telegram bot: get links on attestations 
    * telegram bot: leave feedback
