const mongoose = require("mongoose");

const transcriptSchema = mongoose.Schema({
    title: { type: String, required: true },
    transcript_text: { type: String, required: true },
    audio_url: { type: String, required: true },
    userId: { type: String, required: true },
})

const TranscriptModel = mongoose.model("transcript", transcriptSchema);
module.exports = { TranscriptModel };
