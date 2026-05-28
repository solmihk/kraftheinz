# Release Branch Workflow for Design Contracts

## Goal
Keep upstream Design Contract imports isolated by major release while allowing controlled customization and repeatable packaging/deployment.

## Branch Model
- `X-core`: long-lived branch for a single major release line (for example, `246-core`).
- `X-cust`: long-lived integration branch for project customization (for example, `246-cust`), created from `X-core`.
- `X-cust-feature-<scope>`: short-lived feature branches created from `X-cust`.

## Branch Rules
- Import only `ModelerDesignContract.zip` updates (major + matching patches) into `X-core`.
- Do not add customer-specific logic to `X-core`.
- Merge feature work only into `X-cust`.
- Propagate approved core fixes from `X-core` into `X-cust` via PR/cherry-pick.
- Protect `X-core` and `X-cust` with required review and CI checks.

## Major Release Intake (`X-core`)
1. Create and publish the core branch.
2. Download `ModelerDesignContract.zip` from Lightning App Builder (`Custom - Managed`).
3. Import the zip contents and commit only core contract files.
4. Tag the baseline import for traceability.

Example:
```bash
# start from your default base branch
git checkout main
git pull --ff-only

# create release core branch
git checkout -b 246-core
git push -u origin 246-core

# unzip your downloaded file into repository contract location
unzip ~/Downloads/ModelerDesignContract.zip -d ./contracts

# review and commit only core contract import
git add contracts
git commit -m "Import 246 core design contracts baseline"
git push

# optional baseline tag
git tag v246-core-baseline
git push origin v246-core-baseline
```

## Patch Intake on Existing Core Line
When patch releases for the same major line are published, apply them to the same `X-core` branch.

```bash
git checkout 246-core
git pull --ff-only
unzip ~/Downloads/ModelerDesignContract.zip -d ./contracts
git add contracts
git commit -m "Import 246.x patch core design contracts"
git push
```

Then propagate approved core fixes into customizer:
```bash
git checkout 246-cust
git pull --ff-only
git merge --no-ff 246-core
git push
```

If a full merge is too broad, cherry-pick selected commits:
```bash
git checkout 246-cust
git cherry-pick <core-commit-sha>
git push
```

## Customizer Branch Setup (`X-cust`)
Create once per major release from the matching core branch.

```bash
git checkout 246-core
git pull --ff-only
git checkout -b 246-cust
git push -u origin 246-cust
```

## Feature Development Flow
1. Create feature branch from `X-cust`.
2. Build/test locally.
3. Open PR targeting `X-cust`.
4. Merge only after checks pass.

```bash
git checkout 246-cust
git pull --ff-only
git checkout -b 246-cust-feature-quote-layout
```

## Local CLI Workflow (Customizer and Feature Branches)
Run these commands on `X-cust` and feature branches to validate/build/package and optionally deploy.

### 1) Install prerequisites
```bash
# install Salesforce CLI if not present
sf --version

# install Modeler CLI plugin (name may differ by org package)
sf plugins install @salesforce/plugin-modeler
```

### 2) Authenticate org
```bash
sf org login web --alias target-org
```

### 3) Validate model
```bash
# use your project's model validation command
sf modeler validate --target-org target-org
```

### 4) Build model/contracts
```bash
sf modeler build --target-org target-org
```

### 5) Build deployment artifact
```bash
sf modeler build --target-org target-org --deployment-zip ./dist/deployment.zip
```

### 6) Deploy artifact for testing
```bash
sf modeler deploy --target-org target-org --deployment-zip ./dist/deployment.zip
```

## CI/CD Build Automation
In CI after `git clone`:
1. Install Salesforce CLI.
2. Install Modeler CLI plugin.
3. Authenticate using secure CI auth material.
4. Validate model.
5. Build model.
6. Produce `deployment.zip`.
7. Publish artifact.
8. Optionally deploy to integration org and run smoke tests.

## Governance and Auditability
- Keep a release note per major line that records:
  - imported core patch level
  - merged feature PRs
  - deployment artifact identifiers/checksums
- Use PR titles/messages that clearly classify work:
  - `core import: ...`
  - `core patch: ...`
  - `custom feature: ...`
