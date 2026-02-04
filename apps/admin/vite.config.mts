import type { UserConfig } from 'vite';
import path from 'node:path';
import process from 'node:process';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';

const envPrefix = ['VITE_'];
const analyze = process.env.ANALYZE;

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, envPrefix);

  const plugins: UserConfig['plugins'] = [
    tanstackRouter({
      target: 'react',
      routesDirectory: './src/pages',
      routeFileIgnorePattern: 'components|views|types',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ];

  if (analyze) {
    plugins.push(visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      open: true,
    }));
  }

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    plugins,

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
    },
  };
});
