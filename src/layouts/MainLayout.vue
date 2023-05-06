<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          La Guarderia de papá
        </q-toolbar-title>

        <div>Juanito Banana</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Menu
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Estudiantes',
    caption: 'estudiantes',
    icon: 'school',
    link: 'estudiantes'
  },
  {
    title: 'Acudidores',
    caption: 'Acudiantes',
    icon: 'code',
    link: 'acuidadores'
  },
  {
    title: 'Menu',
    caption: 'menu',
    icon: 'chat',
    link: 'menu'
  },
  {
    title: 'Platillos',
    caption: 'platillos',
    icon: 'record_voice_over',
    link: 'platillos'
  }
];

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
