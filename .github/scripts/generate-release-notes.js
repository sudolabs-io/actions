const { execSync } = require('child_process');

async function run() {
  try {
    // Install required dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install --no-save semantic-release @semantic-release/changelog @semantic-release/git conventional-changelog-conventionalcommits @actions/core', { stdio: 'inherit' });
    
    // Import packages after installation
    const core = require('@actions/core');
    const { default: semanticRelease } = await import('semantic-release');
    
    // Configure and run semantic-release
    console.log('📝 Running semantic-release in dry-run mode...');
    const result = await semanticRelease({
      dryRun: true,
      branches: ['main', 'staging'],
      plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        ['@semantic-release/changelog', {
          changelogFile: 'CHANGELOG.md'
        }],
        ['@semantic-release/git', {
          assets: ['CHANGELOG.md'],
          message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
        }]
      ]
    });
    
    if (!result) {
      console.log('ℹ️ No release necessary. No changes qualify for a release.');
      core.setOutput('version', 'No semantic version change detected');
      core.setOutput('notes', 'No semantic version change detected. This PR only contains changes that don\'t warrant a version bump.');
      return;
    }
    
    const { nextRelease } = result;
    console.log(`✅ Next release version: ${nextRelease.version}`);
    
    // Set outputs using the @actions/core package
    core.setOutput('version', nextRelease.version);
    core.setOutput('notes', nextRelease.notes);
    
    // Get list of commits between main and staging
    console.log('📋 Generating commit list...');
    const commitsList = execSync('git log --pretty=format:"- %h %s (%an)" origin/main..origin/staging').toString();
    
    core.setOutput('commits_list', commitsList);
    
  } catch (error) {
    console.error('❌ Error in semantic-release process:', error);
    // Import core for error case
    const core = require('@actions/core');
    core.setFailed(`❌ Semantic release process failed: ${error.message}`);
  }
}

run(); 