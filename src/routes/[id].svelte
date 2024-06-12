<script context="module">
    export function preload(page) {
        const meetupId = page.params.id;
        return this.fetch(`https://svelte-course-8e5a1-default-rtdb.europe-west1.firebasedatabase.app/meetups/${meetupId}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed!');
                }
                return response.json();
            })
            .then(meetupData => {
                if (!meetupData) {
                    throw new Error('No meetup found')
                }
                return {selectedMeetup: {...meetupData, id: meetupId}};
            })
            .catch(err => {
                this.error(404, 'could not fetch meetups: ' + err.message)
            });

    }
</script>
<script>
    import Button from "../components/UI/Button.svelte";
    export let selectedMeetup;

</script>
<style>
    section {
        margin-top: 4rem;
    }

    .image {
        width: 100%;
        height: 25rem;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .image {
        background: #e7e7e7;
    }

    .content {
        text-align: center;
        width: 80%;
        margin: auto;
    }

    h1 {
        font-size: 2rem;
        font-family: 'Roboto Slab', sans-serif;
        margin: 0.5rem 0;
    }

    h2 {
        font-size: 1.25rem;
        color: #6b6b6b;
    }

    p {
        font-size: 1.5rem;
    }
</style>
<section>
    <div class="image">
        <img src={selectedMeetup.imageUrl} alt={selectedMeetup.title}>
    </div>
    <div class="content">
        <h1>{selectedMeetup.title}</h1>
        <h2>{selectedMeetup.subtitle} - {selectedMeetup.address}</h2>
        <p>{selectedMeetup.description}</p>
        <Button href="mailto:{selectedMeetup.contactEmail}">Contact</Button>
        <Button mode="outline" href="/">Close</Button>
    </div>
</section>