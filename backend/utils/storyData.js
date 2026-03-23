const storyData = {
    1: {
        text: "System Alert: Unauthorized access detected. Door lock engaged. To enter the Server Room, you must override the security script.",
        puzzle: "Identify the output: console.log(typeof NaN)",
        hint: "It's a common JS interview trick!"
    },
    2: {
        text: "The door hisses open. You're in! Ahead are two terminals. The 'Blue' one leads to the Networking Layer (Cyber Path), and the 'Red' one leads to the Application Core (Dev Path).",
        type: "choice",
        options: [
            { id: "Cyber", label: "Blue Terminal (Cyber Security)" },
            { id: "Dev", label: "Red Terminal (Software Dev)" }
        ]
    },
    "Cyber_3": {
        text: "You chose the Cyber Path. A firewall is blocking the uplink. You need to decode the packet header.",
        puzzle: "Decode Base64: 'U3VwZXJTZWN1cmU='",
        hint: "Standard web encoding."
    },
    "Dev_3": {
        text: "You chose the Dev Path. The application database is corrupted. Fix the query to retrieve the admin key.",
        puzzle: "SQL: Find the keyword to sort results in descending order.",
        hint: "Starts with D."
    }
};