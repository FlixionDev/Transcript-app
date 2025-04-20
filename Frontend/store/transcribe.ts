import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import type { TranscribeItem } from "~/types";
const apiPrefix = 'http://localhost:4000'
export const useTranscribeStore = defineStore("transcribe", () => {
    const transcribeList = ref<TranscribeItem[]>([]);
    const transcribeItem = ref<TranscribeItem | null>(null);

    const apiGetTranscribeList = async () => {
        const data = await fetch(`${apiPrefix}/transcript`, {
            headers: {
                "Authorization": localStorage.getItem('token') ?? ""
            }
        })
        const res = await data.json();

        if (res.status === 200) {
            transcribeList.value = res.data
            return res;
        }

        ElMessage.error(res.message);
        return null;

    }

    const apiGetTranscribeById = async (id: string) => {

        const data = await fetch(`${apiPrefix}/transcript/${id}`, {
            headers: {
                "Authorization": localStorage.getItem('token') ?? ""
            }
        })
        const res = await data.json();

        if (res.status === 200) {
            transcribeItem.value = res.data
            return
        }

        ElMessage.error(res.message);
        return null;
    }

    const apiCreateTranscribe = async ({ title, audio }: { title: string, audio: any }) => {
        const formData = new FormData()
        formData.append('title', title);
        formData.append('audio', audio, 'recording.mp4');

        const response = await fetch(`${apiPrefix}/transcript`, {
            method: 'POST',
            body: formData,
            headers: {
                "Authorization": localStorage.getItem('token') ?? ""
            }
        })

        const result = await response.json()
        if (result.status === 200) {
            transcribeList.value.push(result.data);
            return result;
        }
        ElMessage.error(result.message);
        return null
    }

    const apiDeleteTranscribe = async (id: string) => {
        const data = await fetch(`${apiPrefix}/transcript/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": localStorage.getItem('token') ?? ""
            }
        })
        const res = await data.json();
        if (res.status === 200) {

            let index = transcribeList.value.findIndex(item => item._id === id);
            if (index !== -1) {
                transcribeList.value.splice(index, 1);
            }
            return res;
        }

        return null
    }

    return {
        transcribeList,
        transcribeItem,
        apiGetTranscribeList,
        apiGetTranscribeById,
        apiCreateTranscribe,
        apiDeleteTranscribe,
    }
});
