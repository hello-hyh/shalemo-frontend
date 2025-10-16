import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'

import AutoIcons from 'unplugin-icons/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://121.199.2.215:8095',
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [AntDesignVueResolver({ importStyle: false })],
      dirs: ['src/hooks', 'src/utils'],
      dts: './src/types/auto-imports.d.ts',
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({ importStyle: false }),
        IconsResolver({
          componentPrefix: '',
          customCollections: ['mdi', 'ep', 'carbon'],
        }),
      ],
      dirs: 'src/components',
      dts: './src/types/components.d.ts',
    }),
    AutoIcons({
      compiler: 'vue3',
      autoInstall: true,
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
