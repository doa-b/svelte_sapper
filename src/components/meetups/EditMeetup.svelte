<script>
    import TextInput from "../UI/TextInput.svelte";
    import Button from "../UI/Button.svelte";
    import {createEventDispatcher} from "svelte";
    import Modal from "../UI/Modal.svelte";
    import {isEmail, isEmpty} from "../../helpers/validation";
    import meetups from "../../meetups-store";

    export let id = null;

    const dispatch = createEventDispatcher()
    let title = '';
    let subtitle = '';
    let description = '';
    let imageUrl = '';
    let address = '';
    let contactEmail = '';

    if (id) {
        const unsubscribe = meetups.subscribe((item) => {
            const electedMeetup = item.find(i => i.id === id);
            title = electedMeetup.title;
            subtitle = electedMeetup.subtitle;
            description = electedMeetup.description;
            imageUrl = electedMeetup.imageUrl;
            address = electedMeetup.address;
            contactEmail = electedMeetup.contactEmail;
        });
        unsubscribe();
    }

    function submitForm(event) {
        const meetupData = {
            title, subtitle, description,
            imageUrl, address, contactEmail
        }
        event.preventDefault();
        if (id) {
            fetch(`https://svelte-course-8e5a1-default-rtdb.europe-west1.firebasedatabase.app/meetups/${id}.json`, {
                method: 'PATCH',
                body: JSON.stringify(meetupData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed!');
                    }
                    meetups.updateMeetup(id, meetupData);
                })
                .catch(err => console.log('oh oh', err));
        } else {
            fetch("https://svelte-course-8e5a1-default-rtdb.europe-west1.firebasedatabase.app/meetups.json", {
                method: 'POST',
                body: JSON.stringify({...meetupData, isFavorite: false}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed!');
                    }
                    return response.json();
                })
                .then(data => meetups.addMeetup({
                    ...meetupData,
                    isFavorite: false,
                    id: data.name
                }))
                .catch(err => console.log(err));
        }
        dispatch('save');
    }

    function cancel() {
        dispatch('cancel');
    }

    function deleteMeetup() {
        fetch(`https://svelte-course-8e5a1-default-rtdb.europe-west1.firebasedatabase.app/meetups/${id}.json`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed!');
                }
                meetups.removeMeetup(id);
            })
            .catch(err => console.log(err));
        dispatch('save');
    }

    $: titleValid = !isEmpty(title);
    $: subTitleValid = !isEmpty(subtitle);
    $: descriptionValid = !isEmpty(description);
    $: imageUrlValid = !isEmpty(imageUrl);
    $: addressValid = !isEmpty(address);
    $: contactEmailValid = !isEmpty(contactEmail) && isEmail(contactEmail);
    $: formIsValid = titleValid && subTitleValid && descriptionValid
        && imageUrlValid && addressValid && contactEmailValid

</script>
<style>
    form {
        width: 90%;
    }
</style>
<Modal title="Edit Meetup Data" on:cancel>
    <form>
        <TextInput id="title" label="title" value="{title}"
                   on:input={(event) => title = event.target.value}
                   valid={titleValid} validityMessage="Please enter a title"/>
        <TextInput id="subtitle" label="Subtitle" value="{subtitle}"
                   on:input={(event) => subtitle = event.target.value}
                   valid={subTitleValid} validityMessage="Please enter a subtitle"/>
        <TextInput id="address" label="Address" value="{address}"
                   on:input={(event) => address = event.target.value}
                   valid={addressValid} validityMessage="Please enter a address"/>
        <TextInput id="imageUrl" label="image Url" value="{imageUrl}"
                   on:input={(event) => imageUrl = event.target.value}
                   valid={imageUrlValid} validityMessage="Please enter a imageUrl"/>
        <TextInput id="email" type="email"
                   label="Contact Email" value="{contactEmail}"
                   on:input={(event) => contactEmail = event.target.value}
                   valid={contactEmailValid} validityMessage="Please enter a valid email"/>
        <TextInput controlType="textArea" rows="3" id="description"
                   label="Description" bind:value={description}
                   valid={descriptionValid} validityMessage="Please enter a description"/>
    </form>
    <div slot="footer">
        <Button mode="outline" on:click={cancel}>Cancel</Button>
        <Button on:click={submitForm} disabled={!formIsValid}>Save</Button>
        {#if id}
            <Button on:click={deleteMeetup}>Delete</Button>
        {/if}
    </div>
</Modal>