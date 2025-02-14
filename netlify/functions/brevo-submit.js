const fetch = require("node-fetch");

exports.handler = async function (event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    const { email } = JSON.parse(event.body);

    if (!email) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "E-Mail-Adresse erforderlich!" }),
        };
    }

    const data = {
        email: email,
        attributes: {
            FIRSTNAME: "SHIFT NOW Beta-Tester"
        },
        listIds: [1] // Falls deine Brevo-Liste eine andere ID hat, hier anpassen!
    };

    try {
        const response = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY // Hier nutzen wir jetzt die sichere Variable!
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify(responseData),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Erfolgreich registriert!" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Fehler beim Senden der Anfrage." }),
        };
    }
};
