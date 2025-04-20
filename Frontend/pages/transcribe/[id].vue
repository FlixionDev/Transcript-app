<template>
    <div class="page px-6 py-12 lg:px-8" v-loading="isLoading">
        <div class="sm:mx-auto sm:w-full sm:max-w-4xl">

            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold tracking-tight text-white">Transcription Details</h2>
                <el-button type="primary" class="bg-indigo-600 hover:bg-indigo-500 text-white"
                    @click="$router.push('/transcribe')">
                    Back to Transcriptions
                </el-button>
            </div>

            <div v-if="transcribeItem" class="bg-[#1a2238] text-white animate-fade-in" shadow="hover">
                <div class="p-6">

                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-300">Title</label>
                            <p class="mt-1 text-base text-white">{{ transcribeItem.title }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-300">Transcription ID</label>
                            <p class="mt-1 text-base text-white">{{ transcribeItem._id }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-300">User ID</label>
                            <p class="mt-1 text-base text-white">{{ transcribeItem.userId }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-300">Transcription Text</label>
                            <div class="mt-1 p-4 bg-[#222b44] rounded-md text-base text-white max-h-96 overflow-y-auto">
                                {{ transcribeItem.transcript_text || 'No transcription text available' }}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div v-else class="text-center text-gray-400">
                <p>No transcription found.</p>
                <el-button type="primary" class="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white"
                    @click="$router.push('/transcribe')">
                    Back to Transcriptions
                </el-button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, vLoading } from 'element-plus'
import { useTranscribeStore } from '../../store/transcribe'
import { useRoute } from 'vue-router'

const route = useRoute()
const transcribeStore = useTranscribeStore()
const isLoading = ref(false)
const transcribeItem = computed(() => transcribeStore.transcribeItem)

const getTranscribeById = async (id: any) => {
    isLoading.value = true
    try {
        await transcribeStore.apiGetTranscribeById(id)
    } catch (error) {
        ElMessage.error('Failed to load transcriptions')
    } finally {
        isLoading.value = false
    }
}

onMounted(async () => {

    if (transcribeStore.transcribeList.length) {
        let ind = transcribeStore.transcribeList.findIndex((el) => el._id === route.params.id)

        if (ind !== -1) {
            transcribeStore.transcribeItem = transcribeStore.transcribeList[ind];
            return
        }
    }

    await getTranscribeById(route.params.id)
})
</script>
<style lang="scss"></style>
