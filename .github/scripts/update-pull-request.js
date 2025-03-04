const { execSync } = require('child_process');

async function run() {
  try {
    // Install required dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install --no-save @actions/core @actions/github', { stdio: 'inherit' });
    
    // Import packages after installation
    const core = require('@actions/core');
    const github = require('@actions/github');
    
    // Get token from environment
    const token = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(token);
    const context = github.context;
    
    // Get inputs
    const title = process.env.PR_TITLE;
    const version = process.env.VERSION;
    const notes = process.env.NOTES;
    const commitsList = process.env.COMMITS_LIST;
    const prNumber = parseInt(process.env.PR_NUMBER);
    
    // Count the number of commits (if commitsList exists)
    const commitCount = commitsList ? commitsList.split('\n').filter(line => line.trim().length > 0).length : 0;
    
    // Create PR body
    const body = `## 🔥 Release Candidate

This PR merges the latest changes from \`staging\` into \`main\`.

### 📋 Commits Included (${commitCount})
${commitsList}

### 📈 Proposed Version
\`${version}\`

### 📝 Changelog Preview
${notes}

---
✨ *This PR was automatically updated by the Create Release PR workflow.* 🤖`;
    
    // Update PR
    console.log(`🔄 Updating PR #${prNumber}...`);
    await octokit.rest.pulls.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: prNumber,
      title: title,
      body: body
    });
    
    console.log(`✅ Updated existing PR #${prNumber} with new title: ${title}`);
    
  } catch (error) {
    console.error('❌ Error updating PR:', error);
    // Import core for error case if needed
    const core = require('@actions/core');
    core.setFailed(`❌ Failed to update PR: ${error.message}`);
  }
}

run();