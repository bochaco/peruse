import path from 'path';
import fs from 'fs';
import url from 'url';
import logger from 'logger';
import { PROTOCOLS } from 'constants';
/* eslint-disable import/extensions */
import { protocol, app } from 'electron';
/* eslint-enable import/extensions */
import sysUri from '../ffi/sys_uri';

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

const registerSafeAuthProtocol = () =>
{
    logger.info('Register safe-auth scheme');

    sysUri.registerUriScheme( appInfo, PROTOCOLS.SAFE_AUTH );
    //TODO this should just be handles as routes on browser server...
    protocol.registerBufferProtocol( PROTOCOLS.SAFE_AUTH, ( req, cb ) =>
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
        if ( err ) console.error( 'Failed to register protocol' );
    } );
};

export default registerSafeAuthProtocol;
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
