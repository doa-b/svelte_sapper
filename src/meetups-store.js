import {writable} from "svelte/store";

const meetupStore = writable([]);

const customMeetupsStore = {
    subscribe: meetupStore.subscribe,
    setMeetups: (meetups) => {
        meetupStore.set(meetups)
    },
    addMeetup: (meetupData) => {
        meetupStore.update((meetups) =>
            meetups.concat(meetupData));
    },
    updateMeetup: (id, meetupData) => {
        meetupStore.update(items => {
            const meetupIndex = items.findIndex(i => i.id === id);
            const updatedMeetup = {...items[meetupIndex], ...meetupData}
            const updatedMeetups = [...items]
            updatedMeetups[meetupIndex] = updatedMeetup;
            return updatedMeetups;
        })
    },
    removeMeetup: (id) => {
        meetupStore.update(items => {
            return items.filter(item => item.id !== id)
        });
    },
    toggleFavorite: (id) => {
        meetupStore.update((loadedMeetups) => {
            const updatedMeedup = {...loadedMeetups.find(m => m.id === id)};
            updatedMeedup.isFavorite = !updatedMeedup.isFavorite;
            const meetupIndex = loadedMeetups.findIndex(m => m.id === id)
            const updatedMeetups = [...loadedMeetups];
            updatedMeetups[meetupIndex] = updatedMeedup;
            return updatedMeetups;
        })
    }
}

export default customMeetupsStore;