# Security Policy

## Supported versions

The documentation site is a static Astro build. It carries no server-side runtime and
handles no user data, so the security surface is limited to the dependencies it builds
with and the links it renders.

| Version | Supported |
| --- | --- |
| `main` / `develop` | ✅ |
| older commits | ❌ |

## Reporting a vulnerability

**Do not open a public issue for a security problem.**

Email **bitsgenix@gmail.com** with:

- A description of the issue and its impact
- Steps to reproduce
- The commit or deployment affected
- Any suggested mitigation

You will get an acknowledgement within 72 hours and an assessment within seven days.
We will keep you updated as we work on a fix, and we will credit you in the release
notes unless you would prefer otherwise.

## Scope

In scope for this repository:

- Vulnerabilities in the build toolchain or its dependencies
- A page that renders untrusted input unsafely
- A redirect or link that could be abused
- A misconfiguration that exposes secrets in the deployed site

Out of scope — please report these to the relevant repository instead:

| Issue | Repository |
| --- | --- |
| A vulnerability in the Gland runtime | [`glandjs/gland`](https://github.com/glandjs/gland/security/advisories/new) |
| A vulnerability in `@glandjs/events` | [`glandjs/events`](https://github.com/glandjs/events/security/advisories/new) |
| A vulnerability in `@glandjs/emitter` | [`glandjs/emitter`](https://github.com/glandjs/emitter/security/advisories/new) |
| A vulnerability in the HTTP adapters | [`glandjs/http`](https://github.com/glandjs/http/security/advisories/new) |

## How dependencies are handled

[Dependabot](./.github/dependabot.yml) opens weekly pull requests for `npm` and
GitHub Actions updates, grouped so that a Tailwind bump never rides along with an
Astro bump. Review each one and run `pnpm build` before merging — a major-version
bump in Starlight can change component override paths.

## Deployment

The site is deployed to GitHub Pages by
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml), on every push to
`main`. The workflow requests only `contents: read`, `pages: write` and
`id-token: write`.
