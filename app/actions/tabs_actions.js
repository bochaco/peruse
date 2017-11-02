import { createActions } from 'redux-actions';

export const TYPES = {
    ADD_TAB           : 'ADD_TAB',
    CLOSE_TAB         : 'CLOSE_TAB',
    CLOSE_ACTIVE_TAB  : 'CLOSE_ACTIVE_TAB',
    UPDATE_TAB        : 'UPDATE_TAB',
    UPDATE_ACTIVE_TAB : 'UPDATE_ACTIVE_TAB',
    SET_ACTIVE_TAB    : 'SET_ACTIVE_TAB',
    REOPEN_TAB        : 'REOPEN_TAB'
};

export const {
    addTab
    , setActiveTab
    , closeTab
    , closeActiveTab
    , reopenTab
    , updateTab
    , updateActiveTab
} = createActions(
    TYPES.ADD_TAB
    , TYPES.SET_ACTIVE_TAB
    , TYPES.CLOSE_TAB
    , TYPES.CLOSE_ACTIVE_TAB
    , TYPES.REOPEN_TAB
    , TYPES.UPDATE_TAB
    , TYPES.UPDATE_ACTIVE_TAB
);