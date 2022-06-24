const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

try {
  const packageJson = fs.readFileSync("./package.json", "utf-8");
  const parsed = JSON.parse(packageJson);
  const shortSha = github.context.sha.substr(0, 7);
  const tagName = `${parsed.version}-${shortSha}`;

  console.log(`Version: ${parsed.version}`);
  console.log(`Sha: ${github.context.sha}`);
  console.log(`Creating tag: ${tagName}`);

  // const applicationName = github.context.payload.repository.name;
  // const octoKit = github.getOctokit(GITHUB_TOKEN);
  // const environment = core.getInput('environment');
  // const herokuApplicationName = getHerokuApplicationName(environment);
  // console.info(`Environment: ${environment}`);
  // console.info(`Heroku Application Name: ${herokuApplicationName}`);

  core.setOutput("release_tag", tagName);
} catch (error) {
  core.setFailed(error.message);
}

