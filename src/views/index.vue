<template>
  <a-layout class="min-h-screen bg-gray-50">
    <a-layout-header class="bg-white shadow-sm w-full">
      <div class="flex items-center h-full justify-between w-full">
        <h1 class="text-3xl font-bold text-amber-300 text-left">申朴智能</h1>
      </div>
    </a-layout-header>

    <a-layout-content class="h-[calc(100vh-64px)] flex">
      <Sidbar
        :menu-items="menuConfig"
        :collapsed="isCollapsed"
        :icon-map="iconMap"
        @select="handleMenuSelect"
      ></Sidbar>
      <div class="h-full w-full p-4">
        <router-view></router-view>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import Sidbar from './layout/sidbar.vue'
const isCollapsed = ref(false)
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  SettingOutlined,
  TeamOutlined,
  BarChartOutlined,
  LockOutlined,
} from '@ant-design/icons-vue'

const menuConfig = [
  {
    key: 'bid-module',
    label: '招标管理',
    icon: 'dashboard',
    children: [
      { key: 'bid-home', icon: 'chart', label: '智能投标', route: '/' },
      {
        key: 'bid-report',
        label: '智能招标',
        icon: 'chart',
        route: '/bid/biding',
      },
    ],
  },
  {
    key: 'contract-module',
    label: '合同管理',
    icon: 'file',
    children: [
      {
        key: 'contract-list',
        icon: 'calendar',
        label: '合同列表',
        route: '/contract/list',
      },
      {
        key: 'contract-sign',
        label: '合同签署',
        icon: 'calendar',
        route: '/contract/sign',
      },
    ],
  },
  {
    key: 'supplier-module',
    label: '供应商管理',
    icon: 'team',
    children: [
      {
        key: 'supplier-list',
        icon: 'chart',
        label: '供应商目录',
        route: '/supplier/list',
      },
      {
        key: 'supplier-assess',
        label: '绩效评估',
        icon: 'chart',
        route: '/supplier/assess',
      },
    ],
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: 'setting',
    children: [
      {
        key: 'setting-general',
        icon: 'lock',
        label: '常规设置',
        route: '/settings/general',
      },
      {
        key: 'setting-permission',
        label: '权限管理',
        icon: 'lock',
        route: '/settings/permission',
      },
    ],
  },
]

const iconMap = {
  dashboard: DashboardOutlined,
  user: UserOutlined,
  file: FileTextOutlined,
  calendar: CalendarOutlined,
  setting: SettingOutlined,
  team: TeamOutlined,
  chart: BarChartOutlined,
  lock: LockOutlined,
}

const handleMenuSelect = (payload: { key: string; route?: string }) => {
  console.log('selected:', payload)
}
</script>
