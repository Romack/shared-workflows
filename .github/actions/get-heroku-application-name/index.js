const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const yaml = require('yaml');

const getHerokuApplicationName = (environment) => {
  const applicationName = github.context.payload.repository.name;
  const defaultHerokuApplicationName = `invh-${applicationName}-${environment}`;

  const metadata = fs.readFileSync("./.repo-metadata-bad.yaml", "utf-8");
  const parsed = yaml.parse(metadata);
  const herokuApplicationNameOverride = parsed["deployment"]["heroku-application-name"][environment];

  console.log(`Application Name: ${applicationName}`);
  console.log(`Default Heroku Application Name: ${defaultHerokuApplicationName}`);
  console.log(`Heroku Application Name Override: ${herokuApplicationNameOverride}`);

  return herokuApplicationNameOverride
    ? herokuApplicationNameOverride
    : defaultHerokuApplicationName;
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

