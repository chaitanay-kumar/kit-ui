import '../../src/styles/index.css';import React from 'react';import {createRoot} from 'react-dom/client';import {SmartUploadDemo,LiquidCommandPaletteDemo} from '../../src/components/docs/KitDemos';
document.documentElement.classList.toggle('dark',new URLSearchParams(location.search).get('theme')==='dark');
createRoot(document.body.appendChild(document.createElement('div'))).render(<div style={{padding:16}}>{location.search.includes('upload')?<SmartUploadDemo/>:<LiquidCommandPaletteDemo/>}</div>);
