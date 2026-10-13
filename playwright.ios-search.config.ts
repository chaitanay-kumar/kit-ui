import base from './playwright.config';
import {defineConfig} from '@playwright/test';
export default defineConfig({...base,testMatch:'ios-search-parity.spec.ts',use:{...base.use,baseURL:'http://127.0.0.1:5216'},webServer:{command:'npx vite --host 127.0.0.1 --port 5216 --strictPort',url:'http://127.0.0.1:5216',reuseExistingServer:!process.env.CI}});
