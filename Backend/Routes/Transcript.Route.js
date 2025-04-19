const express = require('express');
const mongoose = require('mongoose');
const TranscriptRouter = express.Router();
const multer = require('multer');
const axios = require('axios');
const { TranscriptModel } = require('../Models/Transcript.Model');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

TranscriptRouter.get("/", async (req, res) => {
    const { userId } = req;
    try {
        if (userId) {
            const transcriptData = await TranscriptModel.find({ userId });
            res.send(transcriptData);
        } else {
            res.send({ "message": "Please provide a userId" });
        }
    } catch (err) {
        console.log(err);
        res.send({ "error": err });
    }
})

TranscriptRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid ID format" });
        }
        if (id) {
            const findTranscript = await TranscriptModel.find({ _id: id });
            if (findTranscript.length > 0 && findTranscript[0].userId === req.userId) {
                res.send(findTranscript);
            } else {
                res.send({ "message": "Transcript not found or you do not have permission to view this transcript" });
            }
        } else {
            res.send({ "message": "Please provide an ID" });
        }
    } catch (err) {
        console.log(err);
        res.send({ "error": err });
    }
});

TranscriptRouter.post("/", upload.single('audio'), async (req, res) => {
    const headers = {
        authorization: ASSEMBLYAI_API_KEY,
        'content-type': 'application/json',
    };

    try {
        const title = req.body.title;
        const userId = req.userId;

        const audioData = req.file.buffer;

        const uploadResponse = await axios.post(
            'https://api.assemblyai.com/v2/upload',
            audioData,
            {
                headers: {
                    authorization: ASSEMBLYAI_API_KEY,
                    'content-type': 'application/octet-stream',
                },
            }
        );

        const audioUrl = uploadResponse.data.upload_url;

        const transcriptResponse = await axios.post(
            'https://api.assemblyai.com/v2/transcript',
            { audio_url: audioUrl },
            { headers }
        );

        const transcriptId = transcriptResponse.data.id;

        let completed = false;
        let transcriptText = '';

        while (!completed) {
            const polling = await axios.get(
                `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
                { headers }
            );

            if (polling.data.status === 'completed') {
                completed = true;
                transcriptText = polling.data.text;
            } else if (polling.data.status === 'error') {
                return res.status(500).json({ error: 'Transcription failed.' });
            }

            await new Promise((resolve) => setTimeout(resolve, 3000));
        }

        const newTranscript = new TranscriptModel({
            title,
            transcript_text: transcriptText,
            audio_url: audioUrl,
            userId,
        });

        await newTranscript.save();

        res.json({ message: 'Transcript saved successfully', data: newTranscript });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong during transcription.' });
    }
});

TranscriptRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid ID format" });
        }
        if (id) {
            const findTranscript = await TranscriptModel.find({ _id: id });
            if (findTranscript.length > 0 && findTranscript[0].userId === req.userId) {
                await TranscriptModel.findByIdAndDelete({ _id: id });
                res.send({ "message": "Transcript deleted successfully" });
            } else {
                res.send({ "message": "Transcript not found or you do not have permission to delete this transcript" });
            }
        } else {
            res.send({ "message": "Please provide an ID" });
        }
    } catch (err) {
        console.log(err);
        res.send({ "error": err });
    }
})

module.exports = { TranscriptRouter }; 
