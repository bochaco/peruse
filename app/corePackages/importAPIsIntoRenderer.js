import { ipcRenderer, webFrame } from 'electron';
import rpc from 'pauls-electron-rpc';

const fakeAPI = {
    peruLog : ( ...args ) =>
    {
        cosole.log( ...args );
    }
};

//
// rpc.export( )
//
// // this is a function being called in the webview
// const compileAPIs = ( ) =>
// {
//
// }

export const importAPIsIntoRenderer = ( ) =>
{
    // in beaker this gets the list of APIs.
    // var webAPIs = ipcRenderer.sendSync('get-web-api-manifests', window.location.protocol)
    // it also checks against the current URL
    const webAPIs = ['exampleApi'];

    for ( const k in webAPIs )
    {
    // pure beaker
        const fnsToImport = [];
        const fnsWithCallback = [];
        const fnsWithAsyncCallback = [];
        for ( const fn in webAPIs[k] )
        {
            // // We adapt the functions which contain a callback
            // if ( fn.startsWith( WITH_CALLBACK_TYPE_PREFIX ) )
            // {
            //     // We use a readable type to receive the data from the RPC channel
            //     const manifest = { [fn]: 'readable' };
            //     const rpcAPI = rpc.importAPI( WITH_CALLBACK_TYPE_PREFIX + k, manifest, { timeout: false } );
            //     // We expose the function removing the WITH_CALLBACK_TYPE_PREFIX prefix
            //     const newFnName = fn.replace( WITH_CALLBACK_TYPE_PREFIX, '' );
            //     fnsWithCallback[newFnName] = readableToCallback( rpcAPI[fn] );
            // }
            // else if ( fn.startsWith( WITH_ASYNC_CALLBACK_TYPE_PREFIX ) )
            // {
            //     // We use a readable type to receive the data from the RPC channel
            //     const manifest = { [fn]: 'readable' };
            //     const rpcAPI = rpc.importAPI( WITH_ASYNC_CALLBACK_TYPE_PREFIX + k, manifest, { timeout: false } );
            //     // We expose the function removing the WITH_ASYNC_CALLBACK_TYPE_PREFIX prefix
            //     const newFnName = fn.replace( WITH_ASYNC_CALLBACK_TYPE_PREFIX, '' );
            //     // Provide the safeAppGroupId to map it to all safeApp instances created,
            //     // so they can be automatically freed when the page is closed or refreshed
            //     fnsWithAsyncCallback[newFnName] = readableToAsyncCallback( rpcAPI[fn], safeAppGroupId );
            // }
            // else
            // {
                fnsToImport[fn] = webAPIs[k][fn];
            // }
        }

        window[k] = Object.assign( rpc.importAPI( k, fnsToImport, { timeout: false } ), fnsWithCallback, fnsWithAsyncCallback );
    }
};


// export importAPIsIntoRenderer;
