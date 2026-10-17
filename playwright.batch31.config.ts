import {defineConfig} from '@playwright/test';
import base from './playwright.config';
export default defineConfig({...base,testMatch:['parity-batch31.spec.ts'],use:{...base.use,baseURL:'http://127.0.0.1:5258'},webServer:{command:'npx vite --host 127.0.0.1 --port 5258 --strictPort',url:'http://127.0.0.1:5258',reuseExistingServer:!process.env.CI}});
