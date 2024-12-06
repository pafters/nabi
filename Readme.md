## NABI Master-app

### About

This application is created for beauty salon masters to track their income and keep a schedule and customer data. The wizard can do this on the public part in the personal account of the admin panel, as well as the admin panel is linked to a telegram bot that will notify the wizard of changes and upcoming events

### Start
    You can use the "docker compose up -d" command to run the project

### Dependencies

The backend is built on a microservice architecture using a Moleculer and Nats for communication between them.

And the following technologies are also used:

Api Service - Koa, MongoDB, Mongoose

Telegram Service - Telegraf || Node.js Telegram Bot API

Frontend - React, Redux

More detailed information on each of the services can be found in Readme.md files in the corresponding directory of the service

