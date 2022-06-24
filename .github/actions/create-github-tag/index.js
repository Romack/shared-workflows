const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

try {
  const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');

  const packageJson = fs.readFileSync("./package.json", "utf-8");
  const parsed = JSON.parse(packageJson);
  console.log(`Version: ${parsed.version}`);
  console.log(`GitHub Context: ${JSON.stringify(github.context)}`);

  // const applicationName = github.context.payload.repository.name;

  // const octoKit = github.getOctokit(GITHUB_TOKEN);
  // const environment = core.getInput('environment');
  // const herokuApplicationName = getHerokuApplicationName(environment);
  // console.info(`Environment: ${environment}`);
  // console.info(`Heroku Application Name: ${herokuApplicationName}`);

  core.setOutput("release_tag", "my-test");
} catch (error) {
  core.setFailed(error.message);
}

