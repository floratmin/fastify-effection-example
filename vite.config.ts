/// <reference types="vite/client" />
import {defineConfig} from 'vitest/config';
import {VitePluginNode} from 'vite-plugin-node';

export default defineConfig({
    build: {
        outDir: 'dist',
        target: 'esnext',
        // for minifying the build uncomment the following line
        minify: 'esbuild',
        lib: {
            entry: 'src/main.ts',
            name: 'main',
            fileName: 'main',
            formats: ['es'],
        },
        ssr: 'src/main.ts'
    },
    ssr: {
        noExternal: ['effection'],
    },
    plugins: [
        VitePluginNode({
            adapter: 'fastify',
            appPath: './src/main.ts',
            exportName: 'serverApp',
        }),
    ],
    test: {
        include: [
            'src/**/*.{test,spec}.ts',
        ],
        environment: 'node',
    },
});
