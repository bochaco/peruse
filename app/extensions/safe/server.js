import Hapi from 'hapi';
import { CONFIG, isRunningProduction } from 'constants';
import logger from 'logger';

import url from 'url';
import mime from 'mime';
import path from 'path';

import { initAnon, initMock, getAppObj } from './network';

const server = new Hapi.Server();

let appObj = null;


// TODO: Handle error on network.js and use FetchData method
// const handleError = (err, mimeType, cb) => {
//   // err.css = safeCss;
//
//   // const page = errorTemplate(err);
//
//   // if (mimeType === 'text/html') {
//   //   return cb({ mimeType, data: new Buffer(page) });
//   // }
//   // return cb({ mimeType, data: new Buffer(err.message) });
// };


server.connection( { port: CONFIG.PORT, host: 'localhost' } );


server.route( {
    method  : 'GET',
    path    : '/{link*}',
    handler : async ( request, reply ) =>
    {
        try
        {
            const link = `safe://${request.params.link}`;

            const app = getAppObj();

            logger.info( `Handling SAFE req: ${link}` );

            if ( !app )
            {
                return reply( 'not connected yet' );
            }

            logger.info( `Network state on server conn: ${app.networkState}` );


            const parsedUrl = url.parse(link);
            let mimeType = 'text/html';
            // let fileExt
            if( parsedUrl.pathname && parsedUrl.pathname.length > 1 )
            {
                logger.info('........thereispathname', parsedUrl.pathname)
                const fileExt =  path.extname(path.basename(parsedUrl.pathname));
                mimeType = mime.getType(fileExt);
            }



            const data = await app.webFetch( link );
            logger.info( 'mime for responsessssssssssssssss>>>>>>>>>>>>>>>',mimeType );

            if( mimeType === 'text/html' )
            {
                logger.info( ' type html', mimeType );
                return reply( data.toString() );
            }
            else
            {
                logger.info( 'mimmmeeeeeee type NOT html', mimeType );
                return reply( data ).type( mimeType );
            }

            //else stream handling
        }
        catch ( e )
        {
            logger.error( e );
            return reply( e.message || e );
        }
    }
} );

export const startServer = async ( ) =>
{
    logger.info( 'Starting connection to safe' );

    logger.info('[[[[[????[[isRunningProduction]]]: ', isRunningProduction)
    try
    {
        // can run prod in dev...?
        if ( isRunningProduction )
        {
            logger.info('[[[[[[[[[[[[[[[[[RUNNING PROD]]]]]]]]]]]]]]]]]')
            appObj = await initAnon();
        }
        else
        {
            logger.info('[[[[[[[[[[[[[[[[[RUNNING DEV]]]]]]]]]]]]]]]]]')
            appObj = await initMock();
            // appObj.reconnect();
        }
    }
    catch ( e )
    {
        logger.error( e );
        throw e;
    }

    server.start( ( err ) =>
    {
        if ( err )
        {
            throw err;
        }
        logger.info( `HAPI Server running at: ${server.info.uri}` );
    } );
};

export default startServer;
