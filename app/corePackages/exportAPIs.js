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

var fs = require('fs')
const manifest = {
  // simple method-types
  readFile: 'async',
  readFileSync: 'sync',
  sayHello: 'promise',
  createReadStream: 'readable'
}
const exportAPIsForRenderer = ( ) =>
{
    // export over the 'example-api' channel
    var api = rpc.exportAPI('exampleApi', manifest, {
        // the exported API behaves like normal calls:
        readFile: fs.readFile,
        readFileSync: fs.readFileSync,
        sayHello: () => Promise.resolve('hello!'),
        createReadStream: fs.createReadStream
    })

    // log any errors
    api.on('error', console.log)
}

export default exportAPIsForRenderer;
