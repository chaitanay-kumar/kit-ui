import '../../src/styles/index.css';import React from 'react';import {createRoot} from 'react-dom/client';
import {MeteorsLiveShowcase} from '../../src/components/docs/sections/NewComponentsShowcase';
createRoot(document.body.appendChild(document.createElement('div'))).render(<div id="reference" style={{padding:16}}><MeteorsLiveShowcase/></div>);
