export interface LedgerEntry{
 id:string;timestamp:Date|string;action:string;description:string;author?:string;
 details?:{diff?:string;preview?:string;metadata?:Record<string,any>};restorable?:boolean;
}
