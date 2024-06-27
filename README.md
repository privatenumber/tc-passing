<h1>
	tc-passing
	<a href="https://npm.im/tc-passing"><img src="https://badgen.net/npm/v/tc-passing"></a> <a href="https://npm.im/tc-passing"><img src="https://badgen.net/npm/dm/tc-passing"></a>
</h1>

A command that uses TypeScript to only type check previously passing files

### Why?
When integrating TypeScript into a large codebase, using `tsc --noEmit` type-checks all files and can result in an overwhelming flood of errors. This can make it difficult to spot new errors in files that were previously error-free.

`tc-passing` records the list of files that pass type check so you can be sure your type safe files remain type safe!

<br>

<p align="center">
	<a href="https://github.com/sponsors/privatenumber/sponsorships?tier_id=398771"><img width="412" src="https://raw.githubusercontent.com/privatenumber/sponsors/master/banners/assets/donate.webp"></a>
	<a href="https://github.com/sponsors/privatenumber/sponsorships?tier_id=397608"><img width="412" src="https://raw.githubusercontent.com/privatenumber/sponsors/master/banners/assets/sponsor.webp"></a>
</p>

## 🚀 Install

```bash
npm i tc-passing
```

<sup>Note: `typescript` (or `vue-tsc`) is assumed to be installed already</sup>

## Usage

### 1. Setup (Optional)

You can use `tc-passing` directly with [npx](https://docs.npmjs.com/cli/v10/commands/npx), but for your convenience, it's recommend to add the following commands to your `package.json`:

```json5
{
    "scripts": {
        // ...

        "type-check": "tc-passing",
        "type-check:update": "tc-passing --update"
    },

    "lint-staged": {
        "**/*.{js,ts}": "tc-passing"
    }
}
```

You can also add it to a commit hook or `lint-staged`, but note `tc-passing` does not accept any arguments (e.g. for staged files).


### 2. Recording passing files

Start by running `tc-passing --update` to record the list of files that pass type check. This creates a `.tc-passing` file in your current working directory serving as a baseline for when you type check.

Here's an example of what this file looks like:

```
# Files passing type check (33.33%) (Generated by tc-passing)
path/to/file-a.ts
path/to/file-b.js
```

The first line shows a percentage of how much of the codebase is passing.

Make sure to check this file into version control: `git add .tc-passing`

### 3. Type check

Simply run `tc-passing` and it will only type check files in `.tc-passing`.

Make sure you run `tc-passing --update` periodically or whenever you fix types in a file.

### Type checker

By default, `tc-passing` will expect you to have [`typescript`](https://www.npmjs.com/package/typescript) installed for `tsc`. If you have [`vue-tsc`](https://www.npmjs.com/package/vue-tsc) installed, it will use that instead.

## FAQ

### How does tc-passing compare to [tsc-baseline](https://npmjs.com/package/tsc-baseline)?

Both tools aim to streamline TypeScript integration, but they approach baselining differently:

#### tsc-baseline
- **Focus**

	Only show new type errors since last baseline update.

- **Baseline file**

	JSON file of errors, which can grow large and may lead to merge conflicts in team settings.

- **Workflow impact**

	Requires frequent updates to maintain an accurate baseline, often necessitating updates with every TypeScript-related commit. Otherwise CI can fail. Running `tsc` on every commit can slow down development.

#### tc-passing
- **Focus**

	Type checking ensures files that were previously passing type checks to remain error-free.

- **Baseline file**

	List of passing files, which is typically smaller and easier to manage, reducing merge conflicts.
- **Workflow impact**

	Needs updates less frequently, only necessary when files change from failing to passing, thus streamlining the development process by minimizing the frequency of checks.


## Sponsors
<p align="center">
	<a href="https://github.com/sponsors/privatenumber">
		<img src="https://cdn.jsdelivr.net/gh/privatenumber/sponsors/sponsorkit/sponsors.svg">
	</a>
</p>