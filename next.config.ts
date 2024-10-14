import { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'src', 'styles')],
    },
    experimental: {
        reactCompiler: true,
    },
}

export default nextConfig
