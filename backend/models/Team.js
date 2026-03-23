const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    operativeId: { type: String, required: true, unique: true },
    teamName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    members: [
        {
            fullName: { type: String, required: true } // Name + Surname format
        }
    ],
    currentLevel: { type: Number, default: 1 },
    currentRoute: { type: String, default: '/storyline' },
    chosenPath: { type: String, default: "None" }, // 'Cyber' or 'Dev'
    isTerminated: { type: Boolean, default: false },
    storyProgress: { type: [String], default: [] },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: null },
    isFinished: { type: Boolean, default: false }
});

module.exports = mongoose.model('Team', TeamSchema);