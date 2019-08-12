const policyCheck = document.querySelector('#checkpolicy');
var definedEvents = [
    ['fallevent', 'admin'],
    ['normalevent', 'admin'],
    ['locationevent', 'admin'],
    ['createdoc', 'doc'],
    ['deletedoc', 'doc'],
    ['checkpolicy', policyCheck.dataset.user]
];


// Helper function to trigger a given event
function triggerEvent(event, id) {

    event.addEventListener('click', function (e) {
        fetch(`/${event.id}?username=${id}`, {
                method: 'POST'
            }).then(function (response) {
                response.json().then(function (json) {

                    responseString = response.status + " - " + response.statusText;
                    if (response.ok)
                        return toastr["success"](json.text, responseString);

                    else if (response.status != 401)
                        return toastr["warning"](json.text, responseString);

                    else
                        throw new Error(responseString);
                });
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