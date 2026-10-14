import base from './playwright.config';import {defineConfig} from '@playwright/test';
export default defineConfig({...base,testMatch:['parity-batch25.spec.ts'],use:{...base.use,baseURL:'http://127.0.0.1:5250'},webServer:{command:'npx vite --host 127.0.0.1 --port 5250 --strictPort',url:'http://127.0.0.1:5250',reuseExistingServer:!process.env.CI}});
