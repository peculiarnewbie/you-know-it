<script lang="ts">
	import { onMount } from 'svelte';

    export let data;

    let webSocket: WebSocket | null

    onMount(() => {
        webSocket = new WebSocket(window.location.origin + "/api" + window.location.pathname)
        
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
    })
</script>
<p>what {data.title}</p>