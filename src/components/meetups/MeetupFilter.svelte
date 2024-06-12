<script>
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();

    let selectedButton = 0;

    function filter(value) {
        dispatch('select', value);
        selectedButton = value;
    }
</script>

<style>
    div {
        font-size: 0px;
    }

    button {
        background: #aaaaaa;
        font: inherit;
        font-size: 1rem;
        cursor: pointer;
        border: 1px solid #aaaaaa;
        padding: 0.5rem 1rem;
    }

    button:focus {
        outline: none;
    }

    button:first-of-type {
        border-radius: 5px 0 0 5px;
    }

    button:last-of-type {
        border-radius: 0 5px 5px 0;
    }

    button:hover,
    button:active,
    .active {
        background: #cf0056;
        border-color: #cf0056;
        color: white;
    }

</style>

<div>
    <button class:active={selectedButton === 0}
            type="button" on:click={() => filter(0)}>All
    </button>
    <button class:active={selectedButton === 1}
            type="button" on:click={() => filter(1)}>Favorites
    </button>
</div>