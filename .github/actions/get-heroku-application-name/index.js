const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const yaml = require('yaml');

const REPOSITORY_METADATA_FILE = "./.repo-metadata-bad.yaml";

/**
 * Returns the Heroku Application Name for the given environment
 *
 * This function will check the repository metadata file to see if a name override
 * has been configured for the specified environment.
 *
 * If so, it will return that value.  Otherwise, return the standard heroku application
 * name "invh-<application_name>-<environment>"
 */
const getHerokuApplicationName = (environment) => {
  const applicationName = github.context.payload.repository.name;
  const defaultHerokuApplicationName = `invh-${applicationName}-${environment}`;
  console.log(`Application Name: ${applicationName}`);
  console.log(`Default Heroku Application Name: ${defaultHerokuApplicationName}`);

  if (fs.existsSync(REPOSITORY_METADATA_FILE)) {
    const metadata = fs.readFileSync(REPOSITORY_METADATA_FILE, "utf-8");
    const parsed = yaml.parse(metadata);
    const herokuApplicationNameOverride = parsed["deployment"]["heroku-application-name"][environment];
    console.log(`Heroku Application Name Override: ${herokuApplicationNameOverride}`);

    if (herokuApplicationNameOverride) {
      return herokuApplicationNameOverride;
    }
  }

  return defaultHerokuApplicationName;
}

try {
  const environment = core.getInput('environment');
  const herokuApplicationName = getHerokuApplicationName(environment);
  console.log(`Environment: ${environment}`);
  console.log(`Heroku Application Name: ${herokuApplicationName}`);

  core.setOutput("heroku_application_name", "feenix-dev");

} catch (error) {
  core.setFailed(error.message);
}

