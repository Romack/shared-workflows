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

try {
  const environment = core.getInput('environment');
console.log(`Environment: ${environment}`);
  const repository = github.event.repository.name;
console.log(`Repository: ${repository}`);
  const repositoryOwner = github.repository_owner;
console.log(`Repository Owner: ${repositoryOwner}`);

  const applicationName = github.repository.replace(github.repository_owner, '');
console.log(`Application Name: ${applicationName}`);
  // const defaultHerokuApplicationName =
  // const herokuApplicationNameOverride =
  core.setOutput("heroku_application_name", "feenix-dev");

} catch (error) {
  core.setFailed(error.message);
}
