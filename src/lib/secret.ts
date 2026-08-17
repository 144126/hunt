export type SecretVal = string | { get?: () => Promise<string> };

export async function get_secret(v: SecretVal | undefined): Promise<string> {
	return typeof v === 'string' ? v : ((await v?.get?.()) ?? '');
}