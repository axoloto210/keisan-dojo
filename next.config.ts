import { NextConfig } from 'next'
const path = require('path')

const nextConfig: NextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'src', 'styles')],
        api: 'modern',
        silenceDeprecations: ['legacy-js-api'],
    },
    experimental: {
        reactCompiler: true,
    },
}

export default nextConfig
