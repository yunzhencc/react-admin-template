import type { PluginOption } from 'vite';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const envPrefix = ['VITE_'];

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, envPrefix);

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    plugins: [
      tanstackRouter({
        target: 'react',
        routesDirectory: './src/pages',
        autoCodeSplitting: true,
      }) as PluginOption,
      react(),
      tailwindcss(),
    ],

    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
      // 按需开启
      // 是否生成 source map 文件
      sourcemap: false,
      // 单个 chunk 文件的大小超过 500kB 时发出警告
      chunkSizeWarningLimit: 500,
    },

    server: {
      port: Number(env.VITE_DEV_PORT),
      host: true,
      open: true,
    },
  };
});
