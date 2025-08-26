import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoIcons from 'unplugin-icons/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [],
      dirs: ['src/hooks', 'src/utils'],
      dts: './src/types/auto-imports.d.ts',
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
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
})
