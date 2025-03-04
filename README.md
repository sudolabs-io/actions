# GitHub Workflow Actions 🚀

![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Semantic Release](https://img.shields.io/badge/semantic--release-e10079?style=for-the-badge&logo=semantic-release&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A collection of helpful GitHub Actions workflows to automate your release process, streamline version management, and generate changelogs.

## 📚 Table of Contents

- [✅ Features](#features)
- [🔄 GitHub Workflows](#github-workflows)
  - [🚀 Release Process](#release-process)
    - [1️⃣ Release Candidate Workflow](#release-candidate-workflow)
    - [2️⃣ Release Workflow](#release-workflow)
    - [3️⃣ Required Tokens](#required-tokens)
    - [4️⃣ JavaScript Scripts](#javascript-scripts)
    - [5️⃣ Versioning Rules](#versioning-rules)
- [🔌 Implementing on Existing Project](#getting-started)

___

<a id="features"></a>
## ✅ Features

- ✅ Automated semantic versioning
- ✅ Auto-generated detailed changelogs
- ✅ Release candidate PR creation
- ✅ PR labeling and comment automation
- ✅ GitHub release creation with proper tagging

___ 
<a id="github-workflows"></a>
## 🔄 GitHub Workflows

This repository contains GitHub Actions to automate the release process, streamlining version management and changelog generation.

<a id="release-process"></a>
### 🚀 Release Process

We follow a structured release process using semantic-release for automated version management and changelog generation:

<a id="release-candidate-workflow"></a>
#### 1️⃣ Release Candidate Workflow

The `create-release-pr.yml` workflow automatically creates or updates a Release Candidate PR:

- **Triggers**: Push to `staging` branch or manual workflow dispatch
- **Process**:
  - Checks if `staging` is ahead of `main`
  - Verifies if a release PR already exists
  - Generates release notes and version numbers using semantic-release (dry run)
  - Creates a new PR or updates an existing one with detailed release information
  - Organizes changes with commit details, proposed version, and changelog preview

<a id="release-workflow"></a>
#### 2️⃣ Release Workflow

The `release.yml` workflow handles the actual release process:

- **Triggers**: Push to `main` branch (after PR merge)
- **Process**:
  - Automatically updates the CHANGELOG.md file based on conventional commits
  - Creates GitHub release with proper versioning
  - Tags the release in the repository
  - Adds comments to all included PRs indicating the release version they were included in
  - Marks all included PRs with a "released" label for easy tracking
  - Merges `main` back into the `staging`

<a id="required-tokens"></a>
#### 3️⃣ Required Tokens

- **SEMANTIC_RELEASE_TOKEN**: A GitHub Personal Access Token (PAT) with `repo` permissions, needed to bypass branch protection rules and push directly to protected branches

<a id="javascript-scripts"></a>
#### 4️⃣ JavaScript Scripts

The release process is powered by custom Node.js scripts located in `.github/scripts/`:

- `check-existing-prs.js`: Checks for open PRs from `staging` to `main`
- `generate-release-notes.js`: Executes semantic-release in dry-run mode to generate release notes
- `create-pull-request.js`: Creates a new release PR with formatted release information
- `update-pull-request.js`: Updates an existing PR with the latest release information

<a id="versioning-rules"></a>
#### 5️⃣ Versioning Rules

Our release process follows semantic versioning based on conventional commit messages:

- **Major version** (X.y.z): Incremented when commits contain breaking changes (indicated by `BREAKING CHANGE:` in commit body or `!` after type)
- **Minor version** (x.Y.z): Incremented for `feat:` commits (new features)
- **Patch version** (x.y.Z): Incremented for `fix:` and `perf:` commits (bug fixes and performance improvements)

Documentation-only commits (`docs:` prefix) typically don't trigger a version change.
<br /><br /><br />
This automated process ensures consistent version management, detailed changelogs, and streamlined releases while maintaining PR-based code review workflows.

> **Important:** The `CHANGELOG.md` file should **never** be edited manually. All changes to this file are automatically managed by semantic-release based on conventional commit messages. Manual edits will be overwritten during the next release.

___

<a id="getting-started"></a>
## 🔌 Implementing on Existing Project

To use these workflows in your project:

1. Copy the workflow files from `.github/workflows/` to your repository
2. Copy the `.releaserc.json` file to your repository root (this configures semantic-release)
3. Set up the required secrets in your GitHub repository settings
4. Ensure your team follows [Conventional Commits](https://www.conventionalcommits.org/) formatting
5. Un-comment `on` parts in workflow files, so that workflow triggers in your repository

> **Note:** These workflows reference `main` and `staging` branches by default. If your project uses different branch names (e.g., `master` instead of `main`, or `develop` instead of `staging`), you'll need to adjust the branch names in the workflow files accordingly.

