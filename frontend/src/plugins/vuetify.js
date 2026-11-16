import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

/** Zentrale Vuetify-Konfiguration mit hellem QRent-Theme und lokalen Icons. */
const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'qrentLight',
    themes: {
      qrentLight: {
        dark: false,
        colors: {
          primary: '#D3EEFA',
          'on-primary': '#000000',
          navigation: '#000000',
          'navigation-indicator': '#424242',
          secondary: '#455A64',
          background: '#F3F6FB',
          surface: '#FFFFFF',
          'on-background': '#1B2638',
          'on-surface': '#1B2638',
          success: '#2E7D32',
          info: '#0277BD',
          warning: '#ED6C02',
          error: '#C62828',
        },
      },
    },
  },
  defaults: {
    VCard: { rounded: 'lg', elevation: 1 },
    VBtn: { rounded: 'lg' },
    VTextField: { variant: 'outlined', color: 'primary' },
    VSelect: { variant: 'outlined', color: 'primary' },
    VAlert: { rounded: 'lg' },
  },
})

export default vuetify
