<script lang="ts">
    import "../app.css";

    let count = $state(0);

    function increment(){
        count += 1
    }
</script>
<p class="text-xl">count {count}</p>
<button onclick={increment}>add</button>
