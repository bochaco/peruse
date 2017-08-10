// TODO: This should load all packages either from here or from node_modules etc...
import initSafeBrowsing from './safeBrowsing.js';
import exportAPIsForRenderer from './exportAPIs.js';

// here add your packages for extensibility.
const allPackages = [ initSafeBrowsing ];
// const allAPIPackages = [ safeDOMAPIs ];



export const setupBrowserAPIs = ( ) =>
{
    exportAPIsForRenderer();
};

const loadCorePackages = ( store ) =>
{

    allPackages.forEach( pack => pack( store ) );

    //packages that will return APIs
};


// export setupBrowserAPIs;
export default loadCorePackages;
