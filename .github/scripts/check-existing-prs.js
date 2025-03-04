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
    
    console.log('🔎 Checking for existing PRs...');
    const prs = await octokit.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'open',
      head: 'staging',
      base: 'main'
    });
    
    if (prs.data.length > 0) {
      core.setOutput('has_existing_pr', 'true');
      core.setOutput('pr_number', prs.data[0].number);
      console.log(`✅ Found existing PR: ${prs.data[0].html_url}`);
    } else {
      core.setOutput('has_existing_pr', 'false');
      core.setOutput('pr_number', '');
      console.log('✅ No existing PRs found');
    }
    
  } catch (error) {
    console.error('❌ Error checking for existing PRs:', error);
    // Import core for error case if needed
    const core = require('@actions/core');
    core.setFailed(`❌ Failed to check for existing PRs: ${error.message}`);
  }
}

run(); 