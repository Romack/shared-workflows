const core = require('@actions/core');
const github = require('@actions/github');
const Pivotal = require('pivotaljs');

const PIVOTAL_STORY_ID_REGEX = new RegExp(/\[#[0-9]+\]/);

const extractPivotalStoryId = message => {
  if (PIVOTAL_STORY_ID_REGEX.test(message)) {
    var matchedStoryId = message.match(PIVOTAL_STORY_ID_REGEX)[0];
    var strippedStoryId = matchedStoryId
        .replace(']', '')
        .replace('[', '')
        .replace('#', '');
    return strippedStoryId;
  }
};

try {
  const title = github.context.payload.pull_request.title;
  console.log(`Pull Request Title: ${title}`);

  const pivotalStoryId = extractPivotalStoryId(title);

  if (pivotalStoryId) {
    console.log(`Validating ${pivotalStoryId}`);
    let pivotal = new Pivotal(process.env.PIVOTAL_API_TOKEN);

    pivotal.getStory(pivotalStoryId, function(err, story) {
      if (story.kind === 'story') {
        console.log(`Story: ${JSON.stringify(story)}`);
      } else {
        core.setFailed("Invalid story id");
      }
    });

  } else {
    core.setFailed("Pull request title should include the pivotal story id");
  }

} catch (error) {
  core.setFailed(error.message);
}
