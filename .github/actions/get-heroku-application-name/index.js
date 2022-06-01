const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');

/*
 applicationName=$(echo ${{ github.repository }} | sed "s|${{ github.repository_owner }}/||g")
defaultHerokuApplicationName="invh-${applicationName}-${{ inputs.environment }}"
herokuApplicationNameOverride=$(cat .repo-metadata.yaml| yq '.deployment["heroku-application-name"]'.${{ inputs.environment }} | sed s/\"//g 2>/dev/null)
herokuApplicationName=${herokuApplicationNameOverride:=$defaultHerokuApplicationName}
echo "Default Application Name ${defaultHerokuApplicationName}"
echo "Override Application Name ${herokuApplicationNameOverride}"
echo "Heroku Application Name ${herokuApplicationName}"
*/

const getHerokuApplicationName = () => {
  return "feenix-dev";
}


try {
  const environment = core.getInput('environment');
  console.log(`Environment: ${environment}`);
  console.log(`GitHub Context: ${JSON.stringify(github.context.payload)}`);

  // This makes the assumption that the repository name is the same as the application name
  const applicationName = github.context.payload.repository.name;
  console.log(`Application Name: ${applicationName}`);
  console.log(`Heroku Application Name: ${getHerokuApplicationName()}`);

  // cat .repo-metadata.yaml| yq '.deployment["heroku-application-name"]'.${{ inputs.environment }} | sed s/\"//g 2>/dev/null

  core.setOutput("heroku_application_name", "feenix-dev");

} catch (error) {
  core.setFailed(error.message);
}

