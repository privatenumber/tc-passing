import path from 'node:path';
import { cli } from 'cleye';
import { name, description } from '../package.json';
import { getTsconfig } from './get-tsconfig.js';
import { updateBaseline } from './update-baseline.js';
import { typeCheckBaseline } from './type-check-baseline.js';

(async () => {
	const argv = cli({
		name,
		description,
		flags: {
			update: {
				type: Boolean,
				alias: 'u',
				description: 'Update the baseline list of passing files',
			},
			file: {
				type: String,
				description: 'Path to the baseline file containing files passing type check',
				default: `.${name}`,
			},
			project: {
				type: String,
				alias: 'p',
				description: 'Compile the project given the path to its configuration file, or to a folder with a \'tsconfig.json\'.',
			},
		},
	});

	const tsconfig = await getTsconfig(argv.flags.project ?? process.cwd());
	const baselinePath = path.join(tsconfig.projectPath, argv.flags.file);

	if (argv.flags.update) {
		await updateBaseline(tsconfig, baselinePath);
		return;
	}

	await typeCheckBaseline(tsconfig, baselinePath);
})();
