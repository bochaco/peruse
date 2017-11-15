import path from 'path';
import fs from 'fs';
import url from 'url';
import logger from 'logger';
import { CONFIG, PROTOCOLS } from 'constants';
/* eslint-disable import/extensions */
import { session, app } from 'electron';
/* eslint-enable import/extensions */
import sysUri from '../ffi/sys_uri';
import lib from '../ffi/lib';

const isDevMode = process.execPath.match( /[\\/]electron/ );

const appInfo = {
    id     : 'net.maidsafe.app.browser.authenticator',
    exec   : isDevMode ? `${process.execPath} ${app.getAppPath()}` : app.getPath( 'exe' ),
    vendor : 'MaidSafe.net Ltd',
    name   : 'SAFE Browser Authenticator plugin',
    icon   : 'iconPath'
};

// OSX: Add bundle for electron in dev mode
if ( isDevMode && process.platform === 'darwin' )
{
    appInfo.bundle = 'com.github.electron';
}

export const registerSafeAuthProtocol = () =>
{
    logger.info('Registering safe-auth scheme...');
    const partition = CONFIG.SAFE_PARTITION;
    const ses = session.fromPartition( partition );

    sysUri.registerUriScheme( appInfo, PROTOCOLS.SAFE_AUTH );
    //TODO this should just be handles as routes on browser server...
    ses.protocol.registerBufferProtocol( PROTOCOLS.SAFE_AUTH, ( req, cb ) =>
    {
        const parsedUrl = url.parse( req.url );
        switch ( parsedUrl.pathname )
        {
            case '/bundle.js':
                cb( {
                    mimeType : 'application/javascript',
                    data     : fs.readFileSync( path.resolve( __dirname, 'bundle.js' ) )
                } );
                break;
            case '/bundle.js.map':
                cb( {
                    mimeType : 'application/octet-stream',
                    data     : fs.readFileSync( path.resolve( __dirname, 'bundle.js.map' ) )
                } );
                break;
            case '/favicon.png':
                cb( {
                    mimeType : 'image/png',
                    data     : fs.readFileSync( path.resolve( __dirname, 'favicon.png' ) )
                } );
                break;
            default:
                cb( new Buffer.from('hiiiiiii auth'))
                // cb( { mimeType: 'text/html', data: fs.readFileSync( path.resolve( __dirname, 'app.html' ) ) } );
                break;
        }
    }, ( err ) =>
    {
        if( err )
            logger.error( 'Problem registering safe-auth', err )
    } );
};

export default registerSafeAuthProtocol;


// export const setupAuthFFI = (libPath) => lib.load(libPath).catch((err) => logger.error(err));
/* eslint-enable import/prefer-default-export */


        // load ffi library
    // api.ffi.ffiLoader.loadLibrary()
      // TODO notify on browser

// }
// //
// const scheme = {
//     scheme        : PROTOCOLS.SAFE_AUTH,
//     label         : 'SAFE Authenticator',
//     isStandardURL : true,
//     isInternal    : true,
//     register      : registerSafeAuthProtocol
// };
//
// export default scheme;
