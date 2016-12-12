export const GLOBAL_ACTIONS = {
	API_ERROR: 'API_ERROR',
	NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
};

export function apiError({ api, error }) {
	return {
		type: GLOBAL_ACTIONS.API_ERROR,
		api,
		error,
	}
}

export function notFound({ api, error }) {
	return {
		type: GLOBAL_ACTIONS.NOT_FOUND_ERROR,
		api,
		error
	}
}

export function callCb(callback, args) {
	if (typeof callback === 'function') {
		callback(args);
	}
}
