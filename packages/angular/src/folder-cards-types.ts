import type {TemplateRef} from '@angular/core';
export type FolderBuiltinIcon='layers'|'sparkles'|'terminal'|'cpu'|'close';
export type MacOSFolderIcon=TemplateRef<unknown>|string|number|boolean|null|undefined|{folderBuiltinIcon:FolderBuiltinIcon};
export interface MacOSFolderCardItem{id:string;title:string;description:string;meta?:string;icon?:MacOSFolderIcon}
export const DEFAULT_FOLDER_ITEMS:MacOSFolderCardItem[]=[
 {id:'sync',title:'Registry Sync',description:'Catalog files react to component source changes.',meta:'01',icon:{folderBuiltinIcon:'layers'}},
 {id:'audit',title:'SEO Audit',description:'Generated metadata is verified before release.',meta:'02',icon:{folderBuiltinIcon:'sparkles'}},
 {id:'ship',title:'Component Ship',description:'Consumers install source-owned UI through shadcn.',meta:'03',icon:{folderBuiltinIcon:'terminal'}},
 {id:'engine',title:'Motion Engine',description:'Physics-calibrated spring tokens with zero jitter.',meta:'04',icon:{folderBuiltinIcon:'cpu'}},
];
