import base from './playwright.config';
import {defineConfig} from '@playwright/test';
export default defineConfig({...base,testMatch:'parity-batch5.spec.ts',use:{...base.use,baseURL:'http://127.0.0.1:5220'},webServer:{command:'npx vite --host 127.0.0.1 --port 5220 --strictPort',url:'http://127.0.0.1:5220',reuseExistingServer:!process.env.CI}});
