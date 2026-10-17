import type {ErrorHandler} from '@angular/core';
/** Angular's DOM wrapper turns a thrown listener into preventDefault. React observer errors do not cancel the event. */
export function invokeNativeEventCallback<E extends Event>(callback:((event:E)=>void)|undefined,event:E,errors:ErrorHandler):void{
 try{callback?.(event)}catch(error){queueMicrotask(()=>errors.handleError(error))}
}
