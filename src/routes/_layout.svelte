<script>


	import Header from "../components/UI/Header.svelte";

	export let segment;
</script>

<style>
	main {
		margin-top: 5rem;
		background: #f4f4f4;
	}
</style>

<Header/>
<main>
	<slot></slot>
</main>