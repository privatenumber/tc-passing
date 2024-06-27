import { constants as osConstants } from 'node:os';

export const exitHook = (
	callback: () => void,
) => {
	const exit = (signal: NodeJS.Signals) => {
		callback();

		/**
		 * https://nodejs.org/api/process.html#exit-codes
		 * >128 Signal Exits: If Node.js receives a fatal signal such as SIGKILL or SIGHUP,
		 * then its exit code will be 128 plus the value of the signal code. This is a
		 * standard POSIX practice, since exit codes are defined to be 7-bit integers, and
		 * signal exits set the high-order bit, and then contain the value of the signal code.
		 * For example, signal SIGABRT has value 6, so the expected exit code will be 128 + 6,
		 * or 134.
		 */
		const exitCode = osConstants.signals[signal];
		process.exit(128 + exitCode);
	};

	process.once('SIGINT', exit);
	process.once('SIGTERM', exit);

	return () => {
		process.off('SIGINT', exit);
		process.off('SIGTERM', exit);
	};
};
