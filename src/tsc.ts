import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { findUp } from 'find-up-simple';
import { lookpath } from 'lookpath';

const childPromise = (
	child: ChildProcessWithoutNullStreams,
) => {
	const promise = new Promise<void>((resolve, reject) => {
		child.on('close', resolve);
		child.on('error', reject);
	});
	return Object.assign(child, { promise });
};

export const spawnTsc = async (
	args: string[],
) => {
	const options = {
		env: { ...process.env },
	};

	const nodeModulesBin = await findUp('node_modules/.bin', {
		type: 'directory',
	});

	// Support looking up tsc from cwd
	if (nodeModulesBin) {
		options.env.PATH = [process.env.PATH, nodeModulesBin].join(':');
	}

	const tscCommand = (
		await lookpath('vue-tsc', options)
		?? await lookpath('tsc', options)
	);

	if (!tscCommand) {
		throw new Error('Could not find command `tsc`. Make sure `typescript` installed in the project');
	}

	return childPromise(spawn(tscCommand!, ['--noEmit', ...args], options));
};
