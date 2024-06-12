<script>    import MeetupFilter from "../components/meetups/MeetupFilter.svelte";

import {createEventDispatcher, onDestroy, onMount} from "svelte";
import {flip} from "svelte/animate";
import {scale} from "svelte/transition"
import EditMeetup from "../components/meetups/EditMeetup.svelte";
import LoadingSpinner from "../components/UI/LoadingSpinner.svelte";
import Button from "../components/UI/Button.svelte";
import MeetupItem from "../components/meetups/MeetupItem.svelte";
import meetups from "../meetups-store";

let editMode;
let editedId;
let isLoading;
let fetchedMeetups = [];
let unsubscribe;

const dispatch = createEventDispatcher();

let favsOnly = false;

onMount(() => {
    unsubscribe = meetups.subscribe((items) => {
        fetchedMeetups = items;
    });
    isLoading = true;
    fetch("https://svelte-course-8e5a1-default-rtdb.europe-west1.firebasedatabase.app/meetups.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed!');
            }
            return response.json();
        })
        .then(data => {
            const loadedMeetups = [];
            for (const key in data) {
                loadedMeetups.push({
                    ...data[key],
                    id: key
                })
            }
            // add time to show our nice spinner
            setTimeout(() => {
                meetups.setMeetups(loadedMeetups);
                isLoading = false;
            }, 1000);

        })
        .catch(err => {
            error = err;
            isLoading = false;
        });
});

onDestroy(() => {
    if (unsubscribe) {
        unsubscribe();
    }
})

function setFilter(event) {
    favsOnly = event.detail === 1;
}

$: filteredMeetups = favsOnly ? fetchedMeetups.filter(m => m.isFavorite) : fetchedMeetups;

function savedMeetup() {
    editMode = false;
    editedId = null;
}

function cancelEdit() {
    editMode = null;
    editedId = null;
}

function startEdit(event) {
    editMode = 'edit';
    editedId = event.detail;
}

</script>

<style>
    #meetups {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1rem;
    }

    #meetup-controls {
        margin: 1rem;
        display: flex;
        justify-content: space-between;
    }

    @media (min-width: 768px) {
        #meetups {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    #placeholer {
        margin: 1rem
    }
</style>

<svelte:head>
    <title>All Meetups</title>
</svelte:head>

{#if editMode === 'edit'}
    <EditMeetup on:save={savedMeetup} on:cancel={cancelEdit}
                id={editedId}/>
{/if}
{#if isLoading}
    <LoadingSpinner/>
{:else}
    <section id="meetup-controls">
        <MeetupFilter on:select={setFilter}/>
        <Button on:click={() => dispatch('add')}>New Meetup</Button>
    </section>
    <section id="meetups">
        {#each filteredMeetups as {
            title, subtitle, description, imageUrl,
            address, contactEmail, isFavorite, id
        } (id)}
            <div transition:scale animate:flip={{duration: 300}}>
                <MeetupItem {title} {subtitle} {description} {id} isFav={isFavorite}
                            {imageUrl} {address} email={contactEmail}
                            on:showdetails
                            on:edit
                />
            </div>
        {:else}
            <p id="placeholer">No meetups found. Add one!</p>
        {/each}
    </section>
{/if}

