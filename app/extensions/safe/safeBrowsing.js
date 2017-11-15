import { session } from 'electron';
import url from 'url';
import logger from 'logger';
import { CONFIG } from 'constants';
import startServer from './server';

import registerSafeProtocol from './protocols/safe';
import registerSafeAuthProtocol from './protocols/safe-auth';
import ipc  from './ffi/ipc';

import * as authAPI from './api';

const isForSafeServer = ( parsedUrlObject ) =>
{
    return parsedUrlObject.host === `localhost:${CONFIG.PORT}`;
}

const blockNonSAFERequests = () =>
{
    const filter = {
        urls : ['*://*']
    };

    const safeSession = session.fromPartition( CONFIG.SAFE_PARTITION );

    safeSession.webRequest.onBeforeRequest( filter, ( details, callback ) =>
    {
        const target = url.parse( details.url );

        if ( target.protocol === 'safe:' || target.protocol === 'safe-auth:' || target.protocol === 'chrome-devtools:' ||
            isForSafeServer(target) )
        {
            logger.debug( `Allowing url ${details.url}` );
            callback( {} );
            return;
        }

        logger.debug( 'Blocked req:', details.url );
        callback( { cancel: true } );
    } );
};

const initSafeBrowsing = ( store ) =>
{
    logger.info( 'Registering SAFE Network Protocols' );

    startServer(store);
    registerSafeProtocol();


    // setup auth
    authAPI.ffi.ffiLoader.loadLibrary();

    //dont do this inside if auth ffi as circular dep
    ipc();
    // authAPI.client();
    registerSafeAuthProtocol();
    blockNonSAFERequests();

    // if we want to do something with the store, we would do it here.
    // store.subscribe( () =>
    // {
    // } );
};

export default initSafeBrowsing;
