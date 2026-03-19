import react from '@vitejs/plugin-react-swc';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-plugin-tsconfig-paths';

/**
 * 高级全栈配置方案
 * 包含：性能优化、分包策略、环境变量处理
 */
export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 mode 加载 .env 文件
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      // 在浏览器/终端中实时显示 TypeScript 和 Stylelint 错误
      checker({
        typescript: true,
        enableBuild: true, // 构建时也进行检查
        stylelint: {
          // 修正 lintCommand，匹配 package.json 中的规范
          lintCommand: 'stylelint "./src/**/*.{css,less}"',
        },
      }),
      tsconfigPaths(),
      AutoImport({
        include: [/\.[tj]sx?$/],
        imports: [
          'react',
          'react-router',
          {
            // 额外的自定义引入
            react: ['Suspense', 'useMemo', 'useCallback'],
          },
        ],
        dts: 'src/types/auto-imports.d.ts',
        eslintrc: {
          enabled: true, // 设置为 true 自动生成 .eslintrc-auto-import.json
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),
    ],

    resolve: {
      alias: {
        // 虽然有 tsconfigPaths，但在 config 中显式声明是个好习惯
        '@': path.resolve(__dirname, 'src'),
      },
    },

    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          // 如果有全局变量文件，可以在这里注入
          // modifyVars: { '@primary-color': '#1890ff' },
        },
      },
      // 开启 CSS modules 的局部变量复用
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },

    server: {
      host: true, // 对应 npm run dev --host
      port: 3000,
      open: true, // 启动后自动打开浏览器
      proxy: {
        // 示例：处理 API 请求转发
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (url) => url.replace(/^\/api/, ''),
        },
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production', // 生产环境关闭 sourcemap 减小体积
      minify: 'esbuild', // 默认使用 esbuild 压缩，速度最快
      chunkSizeWarningLimit: 1000, // 调整大文件警告阈值
      rollupOptions: {
        output: {
          // 静态资源分门别类存储
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          // 分包策略：将 react 等基础库强行拆分，避免单个 js 过大
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router'],
          },
        },
      },
    },
  };
});
