import { session } from 'electron';
import url from 'url';
import logger from 'logger';
import { CONFIG, PROTOCOLS } from 'constants';


const registerSafeProtocol = () =>
{
    logger.warn( `${PROTOCOLS.SAFE} Registeringgg` );

    // bind to partition.
    const partition = CONFIG.SAFE_PARTITION;
    const ses = session.fromPartition( partition );

    // TODO: Is it better to have one safe protocol. Would ports automatically routing locally make things simpler?
    ses.protocol.registerHttpProtocol( PROTOCOLS.SAFE, ( req, cb ) =>
    {
        logger.verbose( `safe:// req being parsed: ${req.url}` );
        const parsedUrl = url.parse( req.url );
        let host = parsedUrl.host;

        if ( !host )
        {
            return;
        }

        if ( host.indexOf( '.' ) < 1 )
        {
            host = `www.${parsedUrl.host}`;
        }

        const path = parsedUrl.pathname || '';

        // TODO. Sort out when/where with slash
        const newUrl = `http://localhost:${CONFIG.PORT}/${host}${path}`;

        cb( { url: newUrl } );
    }, ( err ) =>
    {
        if ( err ) console.error( 'Failed to register SAFE protocol' );
    } );
};

export default registerSafeProtocol;
