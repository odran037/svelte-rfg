<script>
	export let labels;
	export let method;
</script>

{#each labels as label}
		<button on:click={() => method(label)}>{label}</button>
{/each}
