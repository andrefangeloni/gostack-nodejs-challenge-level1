const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoFound = repositories.find((repo) => repo.id === id);

  if (!repoFound) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repoFound.title = title;
  repoFound.url = url;
  repoFound.techs = techs;

  return response.json(repoFound);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoFound = repositories.find((repo) => repo.id === id);

  if (!repoFound) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repoFound.likes += 1;

  return response.json(repoFound);
});

module.exports = app;
