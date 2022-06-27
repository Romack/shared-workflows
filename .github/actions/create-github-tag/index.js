const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

const run = async () => {
  const githubToken = core.getInput('github-token');
  console.log(`Token: ${githubToken}`);
  const octokit = github.getOctokit(githubToken);

  const packageJson = fs.readFileSync("./package.json", "utf-8");
  const parsed = JSON.parse(packageJson);
  const shortSha = github.context.sha.substr(0, 7);
  const tagName = `${parsed.version}-${shortSha}`;

  core.info(`Creating tag: ${tagName} for commit: ${github.context.sha}`);
  const annotatedTag = await octokit.rest.git.createTag({
    ...github.context.repo,
    tag: tagName,
    message: tagName,
    object: github.context.sha,
    type: 'commit',
  });

  core.info(`AnnotatedTag tag sha: ${annotatedTag.data.sha}`);
  await octokit.rest.git.createRef({
    ...github.context.repo,
    ref: `refs/tags/${tagName}`,
    sha: annotatedTag.data.sha
  });

  core.setOutput("release_tag", tagName);
}

run().catch(error => core.setFailed(error.message));
