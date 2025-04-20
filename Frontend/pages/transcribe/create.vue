<template>
    <div class="page px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-4xl">

            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold tracking-tight text-white">Create Transcription</h2>
                <el-button type="primary" class="bg-indigo-600 hover:bg-indigo-500 text-white"
                    @click="$router.push('/transcribe')">
                    Back to Transcriptions
                </el-button>
            </div>

            <el-card class="bg-[#1a2238] text-white animate-fade-in" shadow="hover" v-Loading="isLoading">
                <div class="p-6">
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <div>
                            <label for="title" class="block text-sm font-medium text-gray-300">Title</label>
                            <el-input v-model="title" id="title" placeholder="Enter transcription title"
                                class="mt-1 bg-[#222b44] text-white border-none rounded-md input"
                                :class="{ 'border-red-500': titleError }" />
                            <p v-if="titleError" class="mt-1 text-sm text-red-400">{{ titleError }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-300">Audio Recording</label>
                            <div class="mt-2 flex items-center space-x-4">
                                <el-button :type="isRecording ? 'danger' : 'primary'"
                                    class="bg-indigo-600 hover:bg-indigo-500 text-white"
                                    :class="{ 'bg-red-600 hover:bg-red-500': isRecording }" @click="toggleRecording">
                                    {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
                                    <el-icon v-if="isRecording" class="ml-2 animate-pulse">
                                        <Microphone />
                                    </el-icon>
                                </el-button>
                                <el-button v-if="audioBlob" type="warning"
                                    class="bg-yellow-600 hover:bg-yellow-500 text-white" @click="clearRecording">
                                    Re-record
                                </el-button>
                                <span v-if="isRecording" class="text-gray-400">Recording...</span>
                                <span v-else-if="audioBlob" class="text-gray-400">Recording ready</span>
                                <span v-else class="text-gray-400">No recording</span>
                            </div>
                            <div v-if="audioBlob" class="mt-4">
                                <audio controls :src="audioUrl ?? ''">
                                    Your browser does not support the audio element.
                                </audio>
                            </div>

                        </div>

                        <div>
                            <el-button type="primary" native-type="submit"
                                class="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                                :disabled="isRecording || isLoading">
                                Create Transcription
                            </el-button>
                        </div>
                    </form>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTranscribeStore } from '../../store/transcribe'
import { ElMessage, vLoading } from 'element-plus'
import { Loading, Warning, Microphone } from '@element-plus/icons-vue'

const transcribeStore = useTranscribeStore()
const router = useRouter()

const title = ref('')
const titleError = ref<string | null>(null)
const audioBlob = ref<Blob | null>(null)
const audioUrl = ref<string | null>(null)
const isRecording = ref(false)
const isLoading = ref(false)

let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []

const toggleRecording = async () => {
    if (isRecording.value) {
        mediaRecorder?.stop()
        isRecording.value = false
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorder = new MediaRecorder(stream)
            audioChunks = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data)
                }
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunks, { type: 'audio/mp3' })
                audioBlob.value = blob
                audioUrl.value = URL.createObjectURL(blob)
                stream.getTracks().forEach((track) => track.stop())
            }

            mediaRecorder.start()
            isRecording.value = true
        } catch (err) {
            ElMessage.error('Failed to access microphone. Please check permissions.')
        }
    }
}

const clearRecording = () => {
    audioBlob.value = null
    if (audioUrl.value) {
        URL.revokeObjectURL(audioUrl.value)
        audioUrl.value = null
    }
}

const handleSubmit = async () => {

    titleError.value = null
    if (!title.value.trim()) {
        titleError.value = 'Title is required'
        return
    }

    if (!audioBlob.value) {
        ElMessage.error('Please record audio before submitting')
        return
    }

    isLoading.value = true
    try {

        const res = await transcribeStore.apiCreateTranscribe({
            title: title.value,
            audio: audioBlob.value,
        })
        if (res.status === 200) {
            ElMessage.success('Transcription created successfully')
            router.push('/transcribe')
            return
        }

        ElMessage.error('Failed to create transcription. Please try again.')
    } catch (err) {
        console.error(err)
        ElMessage.error("Failed to create transcription. Please try again.")
    } finally {
        isLoading.value = false
    }
}

</script>

<style lang="scss">
.page {
    background: #101828;
    min-height: 100vh;
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.el-card {
    border: none !important;
    background: #1a2238 !important;

    .el-card__body {
        padding: 0 !important;
    }
}

.el-input__inner {
    background: #222b44 !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 6px;
    padding: 10px;
}

.el-input__inner::placeholder {
    color: #6b7280 !important;
}

.animate-pulse {
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.2);
        opacity: 0.7;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.input {
    .el-input__wrapper {
        padding: 0;
        border-radius: 10px;
    }
}
</style>
