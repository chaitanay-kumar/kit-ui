import base from './playwright.config';import {defineConfig} from '@playwright/test';
export default defineConfig({...base,testMatch:['parity-batch22.spec.ts'],use:{...base.use,baseURL:'http://127.0.0.1:5247'},webServer:{command:'npx vite --host 127.0.0.1 --port 5247 --strictPort',url:'http://127.0.0.1:5247',reuseExistingServer:!process.env.CI}});
