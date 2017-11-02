/* eslint-disable func-names */
import tabs from 'reducers/tabs';
import { TYPES } from 'actions/tabs_actions';
import initialState from 'reducers/initialAppState.json';

describe( 'tabs reducer', () =>
{
    const basicTab = {
        url      : 'hello',
        windowId : 1,
    };

    it( 'should return the initial state', () =>
    {
        expect( tabs( undefined, {} ) ).toEqual( initialState.tabs );
    } );

    describe( 'ADD_TAB', () =>
    {
        it( 'should handle adding a tab', () =>
        {
            expect(
                tabs( [], {
                    type    : TYPES.ADD_TAB,
                    payload : { url: 'hello' }
                } )
            ).toEqual( [
                basicTab
            ] );
        } );

        it( 'should handle adding a second tab', () =>
        {
            expect(
                tabs(
                    [basicTab],
                    {
                        type    : TYPES.ADD_TAB,
                        payload : {
                            url : 'another-url'
                        }
                    }
                )
            ).toEqual( [
                basicTab,
                {
                    url      : 'another-url',
                    windowId : 1, // sets initial window it
                }
            ] );
        } );
    } );


    describe( 'SET_ACTIVE_TAB', () =>
    {
        const activeTab = { ...basicTab, isActiveTab: true };

        it( 'should set the active tab', () =>
        {
            expect(
                tabs( [basicTab], {
                    type    : TYPES.SET_ACTIVE_TAB,
                    payload : { index: 0 }
                } )
            ).toEqual( [
                {
                    ...basicTab,
                    isActiveTab : true,
                    isClosed    : false
                }
            ] );
        } );

        it( 'deactivate the previous active tab', () =>
        {
            expect(
                tabs( [activeTab, basicTab], {
                    type    : TYPES.SET_ACTIVE_TAB,
                    payload : { index: 1 }
                } )
            ).toEqual( [
                { ...basicTab, isActiveTab: false },
                {
                    ...basicTab,
                    isActiveTab : true,
                    isClosed    : false
                }
            ] );
        } );
    } );


    describe( 'CLOSE_TAB', () =>
    {
        const activeTab = { ...basicTab, isActiveTab: true };

        it( 'should set the tab as closed and inactive', () =>
        {
            const newTabState = tabs( [activeTab], {
                type    : TYPES.CLOSE_TAB,
                payload : { index: 0 }
            } )[0];

            expect( newTabState ).toMatchObject(
                {
                    ...activeTab,
                    isActiveTab : false,
                    isClosed    : true
                }
            );

            expect( newTabState ).toHaveProperty( 'closedTime' );
        } );

        it( 'should set another tab as active', () =>
        {
            const newState = tabs( [activeTab, basicTab], {
                type    : TYPES.CLOSE_TAB,
                payload : { index: 0 }
            } );

            expect( newState[0] ).toMatchObject(
                {
                    ...activeTab,
                    isActiveTab : false,
                    isClosed    : true
                }
            );

            expect( newState[1] ).toMatchObject(
                {
                    ...basicTab,
                    isActiveTab : true,
                    isClosed    : false
                }
            );
        } );
    } );


    describe( 'CLOSE_ACTIVE_TAB', () =>
    {
        const activeTab = { ...basicTab, isActiveTab: true };

        it( 'should set the active tab as closed and inactive', () =>
        {
            const newState = tabs( [basicTab, basicTab, activeTab], {
                type : TYPES.CLOSE_ACTIVE_TAB
            } );

            expect( newState[2] ).toMatchObject(
                {
                    ...activeTab,
                    isActiveTab : false,
                    isClosed    : true
                }
            );

            expect( newState[2] ).toHaveProperty( 'closedTime' );
        } );
    } );


    describe( 'REOPEN_TAB', () =>
    {
        const closedTab = { ...basicTab, isClosed: true, closedTime: '100' };
        const closedTabOlder = { ...basicTab, isClosed: true, closedTime: '10' };

        it( 'should set the last closed tab to be not closed', () =>
        {
            const newState = tabs( [basicTab, closedTabOlder, closedTab], {
                type : TYPES.REOPEN_TAB
            } );

            expect( newState[2] ).toMatchObject(
                {
                    ...closedTab,
                    isClosed   : false,
                    closedTime : null
                }
            );
        } );
    } );

    describe( 'UPDATE_ACTIVE_TAB', () =>
    {
        const activeTab = { ...basicTab, isActiveTab: true };

        it( 'should update the active tab\'s properties', () =>
        {
            const newState = tabs( [basicTab, basicTab, activeTab], {
                type    : TYPES.UPDATE_ACTIVE_TAB,
                payload : { url: 'changed!', title: 'hi' }
            } );

            expect( newState[2] ).toMatchObject(
                {
                    ...activeTab,
                    url   : 'changed!',
                    title : 'hi'
                }
            );

            expect( newState[2] ).toHaveProperty('history');
        } );
    } );


    describe( 'UPDATE_TAB', () =>
    {
        const activeTab = { ...basicTab, isActiveTab: true };

        it( 'should update the tab specified in the payload', () =>
        {
            const newState = tabs( [basicTab, basicTab, activeTab], {
                type    : TYPES.UPDATE_TAB,
                payload : { url: 'changed again!', title: 'hi', index: 2 }
            } );
            const updatedTab = newState[2];
            expect( updatedTab ).toMatchObject(
                {
                    ...activeTab,
                    url   : 'changed again!',
                    title : 'hi'
                }
            );

            expect( updatedTab ).toHaveProperty('history');
        } );
    } );
} );