const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

const run = async () => {
  const githubToken = core.getInput('github-token');
  const octokit = github.getOctokit(githubToken);

  const packageJson = fs.readFileSync('./package.json', 'utf-8');
  const parsed = JSON.parse(packageJson);
  const shortSha = github.context.sha.substr(0, 7);
  const tagName = `${parsed.version}-${shortSha}`;

  const existing1 = await octokit.rest.git.getTag({
    ...github.context.repo,
    tag_sha: github.context.sha
  }).catch(error => `Tag does not exist: ${JSON.stringify(error)}`);;
  console.log(`Existing 1: ${JSON.stringify(existing1)}`);

  const existing2 = await octokit.rest.git.getRef({
    ...github.context.repo,
    ref: `refs/tags/${tagName}`
  }).catch(error => `Reference does not exist: ${JSON.stringify(error)}`);
  console.log(`Existing 2: ${JSON.stringify(existing2)}`);

  core.info(`Creating tag: ${tagName}, commit: ${github.context.sha}`);
  const annotatedTag = await octokit.rest.git.createTag({
    ...github.context.repo,
    tag: tagName,
    message: tagName,
    object: github.context.sha,
    type: 'commit',
  });

  core.info(`Creating tag reference: ${annotatedTag.data.sha}`);
  await octokit.rest.git.createRef({
    ...github.context.repo,
    ref: `refs/tags/${tagName}`,
    sha: annotatedTag.data.sha
  });

  core.setOutput('tag_name', tagName);
}

run().catch(error => core.setFailed(error.message));
