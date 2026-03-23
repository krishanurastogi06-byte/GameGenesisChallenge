export const level2Storyline = {
    cyber: {
        title: "CYBER PATH — The Encryption Maze",
        introSystem: [
            "Cyber subsystem select ho chuka hai.",
            "Network security layer pe routing ho rahi hai..."
        ],
        officerDialogue: [
            "OBLIVION ne network packets ko fragment kar diya hai.",
            "Har layer ke andar ek hidden data piece chhupa hua hai.",
            "Firewall activate hone se pehle decode karna hoga."
        ],
        teamDialogue: [
            {
                speaker: "Cyber Specialist",
                text: "Fragmented packets… classic misdirection hai."
            },
            {
                speaker: "Systems Analyst",
                text: "Lag raha hai multiple encoding layers ek saath stack ki gayi hain."
            }
        ],
        objective: [
            "Packet stream ko decode karo.",
            "Har encryption layer ko unwrap karo.",
            "Hidden signal ko identify karo."
        ],
    },

    dev: {
        title: "DEV PATH — The Corrupted Schema",
        introSystem: [
            "Database subsystem select ho chuka hai.",
            "Relational core load ho raha hai..."
        ],
        officerDialogue: [
            "Database structure unstable ho chuki hai.",
            "Table relationships corrupt ho gaye hain.",
            "Agar logic fix nahi hua to data permanently lost ho sakta hai."
        ],
        teamDialogue: [
            {
                speaker: "Systems Analyst",
                text: "Tables ek dusre ke against behave kar rahi hain."
            },
            {
                speaker: "Team Leader",
                text: "Hume schema ko normalize karna padega warna system crash ho jayega."
            }
        ],
        objective: [
            "Schema ko analyze karo.",
            "Correct table relationships identify karo.",
            "Data integrity restore karo."
        ]
    }
};