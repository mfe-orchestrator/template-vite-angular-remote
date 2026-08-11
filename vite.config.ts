import angular from '@analogjs/vite-plugin-angular'
import federation from '@originjs/vite-plugin-federation'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    angular(),
    federation({
      name: 'remote_app',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/app/button.component.ts'
      },
      shared: ['@angular/core', '@angular/common', '@angular/platform-browser', 'rxjs']
    })
  ],
  // Drops Angular's development only assertions, the way the Angular CLI does in
  // a production build. Without it the debug helpers end up in the bundle.
  define: {
    ngDevMode: 'false'
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
