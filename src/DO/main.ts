import { DurableObject } from "cloudflare:workers";

export interface Env {
  Rooms: DurableObjectNamespace<Rooms>;
}

// Worker
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.url.endsWith("/websocket")) {
      // Expect to receive a WebSocket Upgrade request.
      // If there is one, accept the request and return a WebSocket Response.
      const upgradeHeader = request.headers.get('Upgrade');
      if (!upgradeHeader || upgradeHeader !== 'websocket') {
        return new Response('Durable Object expected Upgrade: websocket', { status: 426 });
      }

      // This example will refer to the same Durable Object instance,
      // since the name "foo" is hardcoded.
      let id = env.Rooms.idFromName("foo");
      let stub = env.Rooms.get(id);

      return stub.fetch(request);
    }

    return new Response(null, {
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
};

// Durable Object
export class Rooms extends DurableObject {

  async fetch(request: Request): Promise<Response> {
    // Creates two ends of a WebSocket connection.
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    // Calling `acceptWebSocket()` informs the runtime that this WebSocket is to begin terminating
    // request within the Durable Object. It has the effect of "accepting" the connection,
    // and allowing the WebSocket to send and receive messages.
    // Unlike `ws.accept()`, `state.acceptWebSocket(ws)` informs the Workers Runtime that the WebSocket
    // is "hibernatable", so the runtime does not need to pin this Durable Object to memory while
    // the connection is open. During periods of inactivity, the Durable Object can be evicted
    // from memory, but the WebSocket connection will remain open. If at some later point the
    // WebSocket receives a message, the runtime will recreate the Durable Object
    // (run the `constructor`) and deliver the message to the appropriate handler.

    const connectionsCount = this.ctx.getWebSockets().length;

			// TODO use auth instead
			if (connectionsCount <= 1) {
				this.ctx.acceptWebSocket(server, ['presenter']);
			} else {
				this.ctx.acceptWebSocket(server );
				this.ctx.getWebSockets().forEach((ws) => {
					ws.send(
						JSON.stringify({
							type: 'join',
							connectionsCount: connectionsCount
						})
					);
				});
			}

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
		if (this.ctx.getTags(ws).includes('presenter')) {
			this.ctx.getWebSockets().forEach((ws) => {
				ws.send(message);
			});
		}
	}

	async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
		// If the client closes the connection, the runtime will invoke the webSocketClose() handler.
		ws.close(code, 'Durable Object is closing WebSocket');
	}

  // async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
  //   // Upon receiving a message from the client, the server replies with the same message,
  //   // and the total number of connections with the "[Durable Object]: " prefix
  //   ws.send(`[Durable Object] message: ${message}, connections: ${this.ctx.getWebSockets().length}`);
  // }

  // async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
  //   // If the client closes the connection, the runtime will invoke the webSocketClose() handler.
  //   ws.close(code, "Durable Object is closing WebSocket");
  // }
}