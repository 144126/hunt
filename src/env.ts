import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	HUNT_PUSH: { schema: (v) => v }
});