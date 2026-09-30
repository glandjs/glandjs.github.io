# Pull Request Template

## Description

<!-- What does this change, and why? Link the issue it closes. -->

## Type of change

- [ ] **fix** — a wrong statement, a broken link, a code sample that does not compile
- [ ] **feat** — a new page, section, or capability
- [ ] **docs** — wording, structure, or tone of existing content
- [ ] **style** — formatting only
- [ ] **refactor** — restructuring with no behaviour change
- [ ] **chore** — dependencies, tooling, CI, psx/gix configuration

## Page

<!-- Which page(s) does this touch? -->

- [ ] This is mirrored from an upstream repository, and I changed the source first.

<!-- If mirrored, say which file: e.g. `glandjs/emitter` → `docs/CHANGELOG.md` -->

## Checklist

- [ ] I have read the [Contributing Guidelines](../CONTRIBUTING.md).
- [ ] `pnpm build` succeeds.
- [ ] `pnpm check` passes.
- [ ] Internal links use absolute site paths (`/fundamentals/modules`), not relative ones.
- [ ] Any new page is added to `src/data/sidebar.mjs` **and** to `psx.yml`.
- [ ] I checked both the light and the dark theme.
- [ ] Code samples use a `title` where the reader needs to know which file to create.
- [ ] The commit message follows [Conventional Commits](../CONTRIBUTING.md#commit-message-format).

## Notes for reviewers

<!-- Anything that needs a second opinion, or that you were unsure about. -->
