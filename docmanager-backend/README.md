# Docmanager backend

## Description

Backend pour du projet

## Project setup

Se placer dans le dossier du projet
```bash
cd docmanager-backend
```

Construire l'image docker du projet avec une instance redis et postgres
```bash
$ docker compose up --build
```

API directement accessible à l'adresse : [http://localhost:3000](http://localhost:3000)
Play ground accessible à l'adresse : [http://localhost:3000/graphql](http://localhost:3000/graphql)

## Déploiement

Déployé sur Render, accessible à l'adresse : [https://docmanager-backend-latest.onrender.com/graphql](https://docmanager-backend-latest.onrender.com/graphql)
