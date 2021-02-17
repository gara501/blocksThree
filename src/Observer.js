import EventEmitter from "eventemitter3";

export const EVENTS = {
    START: 'START',
    CLICK: 'CLICK',
    GAME_OVER: 'GAME_OVER',
    STACK: 'STACK',
    NEW_GAME: 'NEW_GAME',
    UPDATE_POINTS: 'UPDATE_POINTS'
}

const Observer = new EventEmitter();
export default Observer;
