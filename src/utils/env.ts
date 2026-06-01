import helpers from './helpers'

/**
 * Simple .env file parser
 * Reads and parses .env file without external dependencies
 * Safe for both Node.js and browser environments
 */
export const loadEnv = async (filePath: string = '.env'): Promise<void> => {
    helpers.useSetEnvLoaded(false)

    if (typeof process === 'undefined' || typeof process.versions === 'undefined' || !process.versions.node) {
        return
    }

    try {
        const key = process.env.EXCHANGERATE_API_KEY ??
            process.env.VITE_EXCHANGERATE_API_KEY ??
            process.env.NEXT_EXCHANGERATE_API_KEY ?? ''

        if ((key !== '' && typeof key !== 'undefined') || helpers.useIsEnvLoaded()) return

        if (key.includes('xxxxx')) {
            return void helpers.useSetEnvLoaded(true)
        }

        const nodeOnly = ['node:fs', 'node:path']

        const [{ default: fs }, { default: path }] = await Promise.all([
            import(/*! @vite-ignore */String(nodeOnly[0])),
            import(/*! @vite-ignore */String(nodeOnly[1])),
        ])

        const envPath = path.resolve(process.cwd(), filePath)

        if (!fs.existsSync(envPath)) return

        const content = fs.readFileSync(envPath, 'utf-8')

        for (const line of content.split('\n')) {
            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith('#')) continue

            const match = trimmed.match(/^([^=]+)=(.*)$/)
            if (!match) continue

            const key = match[1].trim()
            let value = match[2].trim()

            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith('\'') && value.endsWith('\''))) {
                value = value.slice(1, -1)
            }

            if (!process.env[key]) {
                process.env[key] = value
            }
        }

        helpers.useSetEnvLoaded(true)
    } catch (error) {
        console.debug('Failed to load .env file:', error)
    }
}
