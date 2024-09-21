import { NextConfig } from 'next'
const path = require('path')

const nextConfig: NextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'src', 'styles')],
    },
    experimental: {
        reactCompiler: true,
    },
}

export default nextConfig
