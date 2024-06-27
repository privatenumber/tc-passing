import path from 'node:path';
import fs from 'node:fs/promises';
import { parseTsconfig } from 'get-tsconfig';

export type TsconfigMeta = {
	tsconfigPath: string;
	projectPath: string;
};

export const getTsconfig = async (
	lookupDirectory: string,
): Promise<TsconfigMeta> => {
	const tsconfigPath = (
		lookupDirectory.endsWith('.json')
			? lookupDirectory
			: path.join(lookupDirectory, 'tsconfig.json')
	);
	const exists = await fs.access(tsconfigPath).then(() => true, () => false);
	if (!exists) {
		throw new Error(`Could not find tsconfig.json in ${lookupDirectory}`);
	}

	const tsconfig = parseTsconfig(tsconfigPath);
	if (!tsconfig) {
		throw new Error('No tsconfig.json found in CWD. Make sure you run this in a directory with a tsconfig.json file');
	}

	const projectPath = path.dirname(tsconfigPath);

	return {
		tsconfigPath,
		projectPath,
	};
};
