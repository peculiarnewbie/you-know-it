<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

    let {data}: {data:PageData} = $props();

    let webSocket: WebSocket | null

    onMount(() => {
        const url = "wss://" + window.location.hostname + "/api" + window.location.pathname + "/websocket"
        console.log(url)
        webSocket = new WebSocket(url)
        
        webSocket.onmessage = (event) => {
			const data = JSON.parse(event.data as string);

			console.log(data);

			// if ("type" in data) {
			// 	if (data.type === "slide") followPresenter(data);
			// 	else if (data.type === "update") {
			// 		slideTracker.presenter = data.slide;
			// 		console.log("updated", data.slide);
			// 	} else if (data.type === "join") {
			// 		if (props.isPresenter) {
			// 			console.log("sending update", slideTracker.presenter);
			// 			webSocket?.send(
			// 				JSON.stringify({
			// 					type: "update",
			// 					slide: slideTracker.presenter,
			// 				})
			// 			);
			// 		}
			// 	}
			// }

			//TODO: after join message update slideTracker.presenter
		};
        webSocket.onopen = (event) =>{
            console.log("connected", webSocket)
        }
    })
</script>
<p>what {data.title}</p>
{#each data.game.players as player }
<p>{player.position}. {player.displayName}</p>	
{/each}
<p>{JSON.stringify(data.game)}</p>