const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const yaml = require('yaml');

const getHerokuApplicationName = (environment) => {
  const applicationName = github.context.payload.repository.name;
  console.log(`Application Name: ${applicationName}`);

  const metadata = fs.readFileSync("./.repo-metadata.yaml", "utf-8");
  console.log(`Metadata: ${metadata}`);

  const parsed = yaml.parse(metadata);
  console.log(`Yaml: ${JSON.stringify(parsed.deployment.heroku-application-name)}`);
  return "feenix-dev";
}

try {
  const environment = core.getInput('environment');
  console.log(`Environment: ${environment}`);

  const herokuApplicationName = getHerokuApplicationName(environment);
  console.log(`Heroku Application Name: ${herokuApplicationName}`);

  // cat .repo-metadata.yaml| yq '.deployment["heroku-application-name"]'.${{ inputs.environment }} | sed s/\"//g 2>/dev/null
  core.setOutput("heroku_application_name", "feenix-dev");

} catch (error) {
  core.setFailed(error.message);
}

