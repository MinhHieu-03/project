import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // 👇 Đây là phần quan trọng
      jsxImportSource: 'react',
      babel: {
        plugins: [
          [
            '@babel/plugin-transform-react-jsx',
            {
              runtime: 'automatic',
            },
          ],
        ],
      },
      // 👇 Hỗ trợ cả .js chứa JSX
      include: /\.(js|jsx)$/,
    }),
  ],
})
