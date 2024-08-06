import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(({ command, mode }) => {
    return {
        clearScreen: false,
        plugins: [
            vue({
                script: {
                    defineModel: true
                }
            }),
            AutoImport({
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            }),
            ElementPlus({})
        ],
        resolve: {
            alias: {
                '@': path.resolve('Src')
            }
        },
        build: {
            target: ['esnext'],
            minify: 'esbuild',
            sourcemap: false,
            emptyOutDir: true,
            assetsDir: 'Source',
            rollupOptions: {
                output: {
                    manualChunks: (id: string) => {
                        if (id.includes('node_modules')) {
                            return 'Vendor';
                        }
                    }
                }
            }
        },
        base: './',
        envDir: './Env',
        root: path.join(__dirname, ''),
        publicDir: 'Public',
        server: {
            port: 6768,
            strictPort: true
        }
    };
});
