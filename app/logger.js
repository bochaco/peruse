import {app} from 'electron';
import util from 'util';
import { env, isRunningUnpacked, isRunningPackaged, isRunningProduction, isRunningDevelopment } from 'constants';
// error, warn, info, verbose, debug, silly

//must be require?
var log = require('electron-log');
// Log level
log.transports.console.level = 'verbose';

/**
 * Set output format template. Available variables:
 * Main: {level}, {text}
 * Date: {y},{m},{d},{h},{i},{s},{ms}
 */
log.transports.console.format = '{h}:{i}:{s}:{ms} {text}';

// Set a function which formats output
log.transports.console.format = (msg) => util.format.apply(util, msg.data);
//
//
//
// // Same as for console transport
log.transports.file.level = 'verbose';
log.transports.file.format = '{h}:{i}:{s}:{ms} {text}';

// Set approximate maximum log size in bytes. When it exceeds,
// the archived log will be saved as the log.old.log file
log.transports.file.maxSize = 5 * 1024 * 1024;

//TODO: add buld ID if prod. Incase you're opening up, NOT THIS BUILD.
log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
log.info( `      Started with node env: ${env} || ${process.env.NODE_ENV}`);
log.info(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

log.info( 'unpacked?', isRunningUnpacked)
log.info( 'isRunningPackaged?', isRunningPackaged)
log.info( 'isRunningProduction?', isRunningProduction)
log.info( 'isRunningDevelopment?', isRunningDevelopment)

process.on('uncaughtException', (err) => {
  log.error('whoops! there was an uncaught error');
  log.error(err);
  log.error(err.file);
  log.error(err.line);
});

process.on('unhandledRejection', (reason, p) => {
  log.error('Unhandled Rejection at:', p, 'reason:', reason);
});

export default log;
