const core = require('@actions/core');
const github = require('@actions/github');
import axios from 'axios';

const run = async () => {
  const apiToken = core.getInput('api-token');
  const application = core.getInput('application');
  const environment = core.getInput('environment');
  const version = core.getInput('version');

  // 2021-09-15T18:03:09.967342Z
  const timestamp = new Date().toISOString();
  core.info(`Recording deployment...`);
  core.info(`Repository Name: ${github.context.payload.repository.name}`);
  core.info(`SHA: ${github.context.sha}`);
  core.info(`Version: ${version}`);
  core.info(`Environment: ${environment}`);
  core.info(`Timestamp: ${timestamp}`);

  await axios.post(
    'https://api-dev.invitationhomes.com/ci-cd/v1/deployments',
    {
      application,
      environment,
      version,
      commit: github.context.sha,
      timestamp: new Date().toISOString(),
      isSuccessful: 'true'
    },
    {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    });
}

run().catch(error => core.setFailed(error.message));
