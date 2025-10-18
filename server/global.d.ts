import type { WebSocket as WsWebSocket, WebSocketServer as WsWebSocketServer } from 'ws';

declare global {
    // Map the project's usage of the global "WebSocket" and "WebSocketServer" names
    // to the ws package types so TypeScript treats them correctly in Node.
    type WebSocket = WsWebSocket;
    type WebSocketServer = WsWebSocketServer;
}

export { };
