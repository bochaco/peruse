import { session } from 'electron';
import url from 'url';
import logger from 'logger';
import { CONFIG } from 'constants';
import startServer from './server';

import registerSafeProtocol from './protocolHandling';

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
        // const referrer = url.parse( details.referrer );
        const target = url.parse( details.url );

        if ( target.protocol === 'safe:' || target.protocol === 'chrome-devtools:' ||
            isForSafeServer(target) )
        {
            logger.verbose( `going to safe API or somewhere safe at least... ${details.url}` );
            callback( {} );
            return;
        }

        logger.verbose( 'Blocked req:', target );
        callback( { cancel: true } );
    } );
};

const initSafeBrowsing = ( store ) =>
{
    logger.info( 'Registering SAFE Network Protocols' );

    startServer(store);
    registerSafeProtocol();
    blockNonSAFERequests();

    // if we want to do something with the store, we would do it here.
    // store.subscribe( () =>
    // {
    // } );
};

export default initSafeBrowsing;
