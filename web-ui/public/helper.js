var definedEvents = ['fallEvent', 'normalEvent', 'locationEvent'];

// Helper function to trigger a given event
function triggerEvent(event, id) {
    event.addEventListener('click', function (e) {
        var eventName = event.id.slice(0, -5);
        fetch(`/event/${eventName}?username=${id}`, {
                method: 'POST'
            })
            .then(function (response) {
                if (response.ok) {
                    return;
                }
                throw new Error('Event request failed.');
            })
            .catch(function (error) {
                console.log(error);
            });
    });
}

// Iterate over defined events and add listener 
definedEvents.forEach(function (event) {
    triggerEvent(document.getElementById(event), 'admin');
})