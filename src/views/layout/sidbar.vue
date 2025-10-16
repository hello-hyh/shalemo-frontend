<!-- src/components/SidebarMenu.vue -->
<template>
  <aside
    :class="[
      'h-full bg-slate-900 text-slate-100 transition-all duration-300 flex flex-col ',
      collapsed ? 'w-16' : 'w-96',
    ]"
  >
    <div
      v-if="title || $slots.header"
      class="px-4 py-3 font-semibold tracking-wide text-sm uppercase text-slate-400"
    >
      <slot name="header">{{ title }}</slot>
    </div>

    <a-menu
      class="flex-1 overflow-y-auto border-r border-slate-800"
      mode="inline"
      :theme="theme"
      :inline-collapsed="collapsed"
      :items="normalizedMenuItems"
      :selectedKeys="selectedKeys"
      :openKeys="openKeys"
      @openChange="handleOpenChange"
      @click="handleSelect"
    />
  </aside>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Component } from 'vue'
import type { MenuProps } from 'ant-design-vue'

type AntdMenuItem = NonNullable<MenuProps['items']>[number]

interface MenuItemConfig {
  key?: string
  label: string
  route?: string
  icon?: string | Component
  disabled?: boolean
  children?: MenuItemConfig[]
}

const props = defineProps<{
  menuItems: MenuItemConfig[]
  collapsed?: boolean
  theme?: MenuProps['theme']
  title?: string
  iconMap?: Record<string, Component>
}>()

const emit = defineEmits<{
  (event: 'select', payload: { key: string; route?: string }): void
}>()

const router = useRouter()
const route = useRoute()

const normalizedMenuItems = ref<AntdMenuItem[]>([])
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])
const routeToKeyMap = ref<Record<string, string>>({})
const keyToRouteMap = ref<Record<string, string>>({})
const keyParentMap = ref<Record<string, string[]>>({})

const theme = computed(() => props.theme ?? 'dark')
const collapsed = computed(() => props.collapsed ?? false)
const title = computed(() => props.title ?? '')

const resolveIcon = (icon?: string | Component) => {
  if (!icon) return null
  if (typeof icon === 'string') {
    return props.iconMap?.[icon] ?? null
  }
  return icon
}

const rebuildMenu = () => {
  const routeMap: Record<string, string> = {}
  const keyRouteMap: Record<string, string> = {}
  const parentMap: Record<string, string[]> = {}

  const normalize = (
    items: MenuItemConfig[],
    parents: string[] = []
  ): AntdMenuItem[] =>
    items.map((item) => {
      const key = item.key || item.route || item.label
      const iconComponent = resolveIcon(item.icon)
      const normalized: AntdMenuItem = {
        key,
        label: item.label,
        disabled: item.disabled ?? false,
        icon: iconComponent
          ? () => h(iconComponent, { class: 'text-base' })
          : undefined,
      }

      if (item.route) {
        routeMap[item.route] = key
        keyRouteMap[key] = item.route
      }
      parentMap[key] = parents

      if (item.children?.length) {
        normalized.children = normalize(item.children, [...parents, key])
      }

      return normalized
    })

  normalizedMenuItems.value = normalize(props.menuItems)
  routeToKeyMap.value = routeMap
  keyToRouteMap.value = keyRouteMap
  keyParentMap.value = parentMap
  syncWithRoute()
}

const syncWithRoute = () => {
  const currentPath = route.path
  const matchedKey = routeToKeyMap.value[currentPath]
  if (!matchedKey) return

  selectedKeys.value = [matchedKey]
  if (!collapsed.value) {
    openKeys.value = keyParentMap.value[matchedKey] ?? []
  }
}

watch(
  () => props.menuItems,
  () => rebuildMenu(),
  { deep: true, immediate: true }
)

watch(
  () => route.path,
  () => syncWithRoute(),
  { immediate: true }
)

watch(
  () => collapsed.value,
  (isCollapsed) => {
    if (isCollapsed) {
      openKeys.value = []
    } else {
      syncWithRoute()
    }
  }
)

const handleSelect = ({ key }: { key: string }) => {
  const targetRoute = keyToRouteMap.value[key]
  if (targetRoute && targetRoute !== route.path) {
    router.push(targetRoute)
  }
  selectedKeys.value = [key]
  emit('select', { key, route: targetRoute })
}

const handleOpenChange = (nextOpenKeys: string[]) => {
  openKeys.value = nextOpenKeys
}
</script>

<style scoped>
/* Tailwind 负责主要样式，可按需扩展 */
</style>
