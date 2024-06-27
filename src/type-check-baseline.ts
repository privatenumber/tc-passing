import path from 'node:path';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import split from 'split2';
import type { TsconfigMeta } from './get-tsconfig.js';
import { spawnTsc } from './tsc.js';
import { exitHook } from './exit-hook.js';

const getPassingFiles = async (
	baselinePath: string,
) => {
	const exists = await fs.access(baselinePath).then(() => true, () => false);
	if (!exists) {
		throw new Error(`Could not find baseline file at ${baselinePath}\nRun with --update to generate a baseline file`);
	}

	const wasPassingString = await fs.readFile(baselinePath, 'utf8');
	return wasPassingString.split('\n').slice(1);
};

const tscFilepathAnsiCode = '\u001B[96m';

export const typeCheckBaseline = async (
	tsconfig: TsconfigMeta,
	baselinePath: string,
) => {
	const passingFiles = await getPassingFiles(baselinePath);

	/**
	 * TypeScript exits without type checking if there's a syntax error in a file
	 * Only checking files that were passing before allows us to bypass this issue
	 * Note: TS resolves imported files and also type checks them so we filter again after
	 */
	const temporaryTsconfigPath = path.join(tsconfig.projectPath, `.tsconfig.${Date.now()}.json`);

	await fs.writeFile(
		temporaryTsconfigPath,
		JSON.stringify({
			extends: tsconfig.tsconfigPath,
			files: passingFiles,
			include: [],
		}),
	);

	const cleanupTsconfig = () => {
		removeExitHook();
		fsSync.rmSync(temporaryTsconfigPath);
	};
	const removeExitHook = exitHook(cleanupTsconfig);

	const relativeProjectPath = path.relative(process.cwd(), tsconfig.projectPath);

	try {
		const child = await spawnTsc(['--pretty', '-p', temporaryTsconfigPath]);
		child.stdout
			.pipe(split(`\n\n${tscFilepathAnsiCode}`))
			.on('data', (data) => {
				data = data.toString();

				// First error doesn't have a new line
				if (data.startsWith(tscFilepathAnsiCode)) {
					data = data.slice(tscFilepathAnsiCode.length);
				}

				// Seems this only happen on vue-tsc
				const hasReport = data.indexOf('\n\nFound ');
				if (hasReport > -1) {
					data = data.slice(0, hasReport + 2);
				}

				const hasFilename = data.indexOf('\u001B[0m:');
				if (hasFilename === -1) {
					return;
				}

				let filename = data.slice(0, hasFilename);

				// Resolve filename relative to --project
				if (relativeProjectPath && filename.startsWith(`${relativeProjectPath}/`)) {
					filename = filename.slice(relativeProjectPath.length + 1);
				}

				if (passingFiles.includes(filename)) {
					process.stdout.write(`${tscFilepathAnsiCode + data}\n`);
					process.exitCode = 1;
				}
			});

		await child.promise;
	} finally {
		cleanupTsconfig();
	}
};
