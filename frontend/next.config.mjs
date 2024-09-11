/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "arweave.net",
                pathname: "/**",
                port: ''
            },
            {
                protocol: "https",
                hostname: "cf-ipfs.com",
                pathname: "ipfs/**",
                port: ''
            },
        ]
    }
};

export default nextConfig;
