// Actions you can take on the App
export enum Action {
    JOINED,
    LEFT,
    RENAME
}

// Socket.io events
export enum Event {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    CONNECT_ERROR = 'connect_error',
    RECONNECT_ERROR = 'reconnect_error'
}

export enum AudioType {
    INT8,
    INT16,
    INT32,
    FLOAT32
}

export type FFTBlock  = [number, number] //frequency, magnitude

export type FFTSpectrum = FFTBlock[];