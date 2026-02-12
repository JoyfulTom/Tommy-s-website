const events = [];
let currentEditingEvent = null;

function updateLocationOptions(value) {
    const locationField = document.getElementById("location_field");
    const remoteField = document.getElementById("remote_url_field");
    const locationInput = document.getElementById("event_location");
    const remoteInput = document.getElementById("event_remote_url");

    if (value === "remote") {
        locationField.style.display = "none";
        remoteField.style.display = "block";
        locationInput.required = false;
        remoteInput.required = true;
    } else {
        locationField.style.display = "block";
        remoteField.style.display = "none";
        locationInput.required = true;
        remoteInput.required = false;
    }
}



function saveEvent() {
    const form = document.getElementById("event_form");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const eventDetails = {
        name: document.getElementById("event_name").value,
        weekday: document.getElementById("event_weekday").value.toLowerCase(),
        time: document.getElementById("event_time").value,
        modality: document.getElementById("event_modality").value,
        location: document.getElementById("event_modality").value === "in-person"
            ? document.getElementById("event_location").value
            : null,
        remote_url: document.getElementById("event_modality").value === "remote"
            ? document.getElementById("event_remote_url").value
            : null,
        attendees: document.getElementById("event_attendees").value,
        category: document.getElementById("event_category").value
    };

    if (currentEditingEvent) {

        Object.assign(currentEditingEvent, eventDetails);


        if (currentEditingEvent._cardRef) {
            currentEditingEvent._cardRef.remove();
        }


        addEventToCalendarUI(currentEditingEvent);

        currentEditingEvent = null;
    } else {

        events.push(eventDetails);
        addEventToCalendarUI(eventDetails);
    }

    form.reset();
    updateLocationOptions("in-person");

    const myModalElement = document.getElementById("event_modal");
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.hide();

    console.log(events);
}



function addEventToCalendarUI(eventInfo) {
    const dayColumn = document.getElementById(eventInfo.weekday);
    if (!dayColumn) return;

    const eventCard = createEventCard(eventInfo);
    dayColumn.appendChild(eventCard);
}

function createEventCard(eventDetails) {
    const event_element = document.createElement("div");
    event_element.classList = "event row border rounded m-1 py-1";

    const categoryColors = {
        academic: "#FFD966",
        work: "#A4C2F4",
        personal: "#FFB6C1",
        other: "#D9D9D9"
    };
    event_element.style.backgroundColor = categoryColors[eventDetails.category] || "#FFFFFF";

    const info = document.createElement("div");
    info.innerHTML = `
        <strong>${eventDetails.name}</strong><br>
        Time: ${eventDetails.time}<br>
        ${eventDetails.modality === "in-person"
            ? `Location: ${eventDetails.location}`
            : `Remote URL: <a href="${eventDetails.remote_url}" target="_blank">${eventDetails.remote_url}</a>`}<br>
        Attendees: ${eventDetails.attendees}<br>
        Category: ${eventDetails.category.charAt(0).toUpperCase() + eventDetails.category.slice(1)}
    `;
    event_element.appendChild(info);

    eventDetails._cardRef = event_element;

    event_element.addEventListener("click", () => {
        currentEditingEvent = eventDetails;
        openModalWithEvent(eventDetails);
    });

    return event_element;
}


function openModalWithEvent(eventDetails) {
    document.getElementById("event_name").value = eventDetails.name;
    document.getElementById("event_weekday").value = eventDetails.weekday.charAt(0).toUpperCase() + eventDetails.weekday.slice(1);
    document.getElementById("event_time").value = eventDetails.time;
    document.getElementById("event_modality").value = eventDetails.modality;
    updateLocationOptions(eventDetails.modality);

    document.getElementById("event_location").value = eventDetails.location || "";
    document.getElementById("event_remote_url").value = eventDetails.remote_url || "";
    document.getElementById("event_attendees").value = eventDetails.attendees;
    document.getElementById("event_category").value = eventDetails.category;

    const modalElement = document.getElementById("event_modal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
}

