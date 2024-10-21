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
      name: '@electron-forge/maker-squirrel'
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
