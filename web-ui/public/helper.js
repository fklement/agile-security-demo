var definedEvents = [
    ['fallevent', 'admin'],
    ['normalevent', 'admin'],
    ['locationevent', 'admin'],
    ['createdoc', 'doc'],
    ['deletedoc', 'doc'],
    ['checkpolicy', 'admin']
];


// Helper function to trigger a given event
function triggerEvent(event, id) {
    event.addEventListener('click', function (e) {
        fetch(`/${event.id}?username=${id}`, {
                method: 'POST'
            })
            .then(function (response) {
                responseString = response.status + " - " + response.statusText;
                if (response.ok)
                    return toastr.success(responseString, {
                        timeOut: 10000
                    });

                else if (response.status != 401)
                    return toastr.warning(responseString, {
                        timeOut: 10000
                    });

                else
                    throw new Error(responseString);
            })
            .catch(function (error) {
                toastr.error(error, {
                    timeOut: 10000
                });
            });
    });
}

// Iterate over defined events and add listener 
definedEvents.forEach(function (event) {
    triggerEvent(document.getElementById(event[0]), event[1]);
})