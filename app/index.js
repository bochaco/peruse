import React from 'react';
import { render } from 'react-dom';
import { ipcRenderer } from 'electron';
import { hashHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';
import { syncHistoryWithStore } from 'react-router-redux';
import Root from './containers/Root';
import configureStore from './store/configureStore';
import './app.global.css';
import { rendererSync } from './store/electronStoreSyncer';
// import {importAPIsIntoRenderer} from './corePackages/importAPIsIntoRenderer';

const store = configureStore();
const history = syncHistoryWithStore( hashHistory, store );

rendererSync( store );

import fs from 'fs';
import EventEmitter from 'events';

let x = new EventEmitter();


const fakeAPI = {
    peruLog : ( ...args ) =>
    {
        console.log( ...args );
        console.log( new Date() );
    }
};

window.fakeAPI = fakeAPI;

//rewrite of RPC needed to import here and not just as preload.

// and here we setup the APIs for the render. This is NOT the same as the webview els, it enabels UI use if APIs.
// importAPIsIntoRenderer();

render(
    <AppContainer>
        <Root store={ store } history={ history } />
    </AppContainer>,
  document.getElementById( 'root' )
);

if ( module.hot )
{
    module.hot.accept( './containers/Root', () =>
{
        const NextRoot = require( './containers/Root' ); // eslint-disable-line global-require
        render(
            <AppContainer>
                <NextRoot store={ store } history={ history } />
            </AppContainer>,
      document.getElementById( 'root' )
    );
    } );
}
