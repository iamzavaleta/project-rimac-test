<!--
title: 'AWS Simple HTTP Endpoint example in NodeJS'
description: 'This template demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# Serverless Framework Node HTTP API on AWS

This template demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.

This template does not include any kind of persistence (database). For more advanced examples, check out the [serverless/examples repository](https://github.com/serverless/examples/) which includes Typescript, Mongo, DynamoDB and other examples.

## How to Use
### Change database from Resources in serverless.yml configuration

✔ Steps to run project

✔ Install serverless framework -> npm install -g serverless

✔ Install node modules -> npm install --save-prod

✔ Run project locally -> Install dev dependencies: npm install --only=dev -> Run project locally: serverless offline start
### Deployment

```
$ serverless deploy
```

After deploying, you should see output similar to:

```bash
Deploying aws-node-http-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-http-api-project-dev (152s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  getPeople: project-indra-rimac-dev-getPeople (17 MB)
  createPeople: project-indra-rimac-dev-createPeople (17 MB)
  getByIdPeople: project-indra-rimac-dev-getByIdPeople (17 MB)
  updatePeople: project-indra-rimac-dev-updatePeople (17 MB)
  deletePeople: project-indra-rimac-dev-deletePeople (17 MB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [http event docs](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/).
