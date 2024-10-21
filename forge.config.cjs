module.exports = {
  packagerConfig: {
    name: 'Planilha Notas Mapa',
    asar: true,
    osxSign: {},
    appCategoryType: 'public.app-category.developer-tools',
    ignore: [
      /^\/src/,
      /(.eslintrc.json)|(.gitignore)|(electron.vite.config.ts)|(forge.config.cjs)|(tsconfig.*)/
    ]
  },
  rebuildConfig: {
    force: true
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'PlanilhaNotasMapa',
        // setupIcon: './path/to/icon.ico', // Opcional: ícone do instalador
        shortcutName: 'Planilha Notas Mapa', // Nome do atalho criado
        // Cria atalho na área de trabalho e no menu iniciar
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutFolder: 'Planilha Notas Mapa' // Nome da pasta no menu iniciar
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        arch: 'x64'
      }
    }
  ]
}
