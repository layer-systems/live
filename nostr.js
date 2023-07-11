const pool = new window.NostrTools.SimplePool();
let relays = ["wss://relay.damus.io", "wss://relay.nostr.band", "wss://relay.layer.systems"];

nostrGetStreams();

async function nostrGetStreams() {
    let sub = pool.sub([...relays], [
        {
            kinds: [30311],
            limit: 10,
        }
    ])
    sub.on('event', data => {
        console.log(data);

        let formattedCreatedAt = new Date(data.created_at * 1000).toLocaleString();
        let pubkey = data.pubkey;
        let title = "";
        let summary = "";
        let image = "";
        let streaming = ""; 
        let status = "";
        let d = "";
        let id = data.id;

        for(let i = 0; i < data.tags.length; i++) {
            if(data.tags[i][0] == ('title')) {
                title = data.tags[i][1];
            }
            if(data.tags[i][0] == ('summary')) {
                summary = data.tags[i][1];
            }
            if(data.tags[i][0] == ('image')) {
                image = data.tags[i][1];
            }
            if(data.tags[i][0] == ('streaming')) {
                streaming = data.tags[i][1];
            }
            if(data.tags[i][0] == ('status')) {
                status = data.tags[i][1];
            }
            if(data.tags[i][0] == ('d')) {
                d = data.tags[i][1];
            }
        }

        if(status == "live") {
            // Create a random div number
            const divNumber = Math.floor(Math.random() * 999999);
            // Create the outer div with class "card"
            const cardDiv = document.createElement("div");
            cardDiv.classList.add("card");

            // Create the inner div with class "card-body"
            const cardBodyDiv = document.createElement("div");
            cardBodyDiv.classList.add("card-body");

            // Create the sender placeholder h5 element with class "card-title"
            const senderH5 = document.createElement("h5");
            senderH5.classList.add("card-title");
            senderH5.textContent = title + " - " + pubkey;
            senderH5.id = pubkey+""+divNumber;

            // Create the lightning bolt icon element
            const lightningIcon = document.createElement("i");
            lightningIcon.classList.add("bi", "bi-lightning-fill");

            // Create the p element with the satoshi amount and lightning icon
            const satoshiP = document.createElement("p");
            satoshiP.textContent = summary;
            satoshiP.prepend(lightningIcon);

            // Create the receiver placeholder h5 element with class "card-title"
            // const receiverH5 = document.createElement("h5");
            // receiverH5.classList.add("card-title");
            // receiverH5.textContent = streaming;
            // ===================
            // const receiverH5 = document.createElement("video");
            // receiverH5.classList.add("card-title");
            // receiverH5.id = "video"+divNumber;
            // receiverH5.src = streaming;
            // const videoSource = document.createElement("source");
            // videoSource.src = streaming;
            // receiverH5.appendChild(videoSource);
            // ===================
            const idEncoded = NostrTools.nip19.noteEncode(id);
            const nostrAppLink = "https://nostrapp.link/#"+idEncoded;
            const receiverH5 = document.createElement("a");
            receiverH5.href = nostrAppLink;
            receiverH5.target = "_blank";
            receiverH5.textContent = "Watch";
            // receiverH5.classList.add("card-title");
            receiverH5.textContent = "Watch";

            const dateDiv = document.createElement("div");
            dateDiv.classList.add("card-date");
            dateDiv.textContent = formattedCreatedAt + " - " + status;

            // Append all the elements together to form the structure
            cardBodyDiv.appendChild(senderH5);
            cardBodyDiv.appendChild(satoshiP);
            cardBodyDiv.appendChild(receiverH5);
            cardBodyDiv.appendChild(dateDiv); // add date element
            cardDiv.appendChild(cardBodyDiv);

            // Insert the card div to the body of the document
            document.getElementById('cards').insertBefore(cardDiv, document.getElementById('cards').firstChild);

            // Get the username of the sender
            nostrGetUserinfo(pubkey, divNumber, title);
        }

    })
    sub.on('eose', () => {
        // sub.unsub()
    })
}

async function nostrGetUserinfo(pubkey, divNumber, title) {
    let sub = pool.sub([...relays], [
        {
            kinds: [0],
            authors: [pubkey],
            limit: 1
        }
    ])
    sub.on('event', data => {
        const username = JSON.parse(data.content)['username'];
        const displayName = JSON.parse(data.content)['displayName'];
        const name = JSON.parse(data.content)['name'];

        usernameElement = document.getElementById(pubkey+divNumber);

        if (typeof displayName !== "undefined" && displayName !== "") {
            usernameElement.textContent = `${title} - ${displayName}`;
        } else if (typeof name !== "undefined" && name !== "") {
            usernameElement.textContent = `${title} - ${name}`;
        } else {
            if(username !== "undefined" && username !== "") {
                usernameElement.textContent = `${title} - ${username}`;
            }
        }
    })
    sub.on('eose', () => {
        sub.unsub()
    })
}