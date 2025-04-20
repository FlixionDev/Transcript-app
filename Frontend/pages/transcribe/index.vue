<template>
    <div class="page" v-loading="isLoading">
        <div>
            <h2 class="mb-6 text-2xl font-bold tracking-tight text-white">Your Transcriptions</h2>
            <el-table :data="transcribeList" style="width: 100%" stripe class="list-table bg-[#1a2238] rounded-lg"
                :row-class-name="tableRowClassName">
                <el-table-column prop="_id" label="S. No." width="100" align="center">
                    <template #default="scope">
                        <span class="text-gray-300">{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="Title" min-width="200">
                    <template #default="scope">
                        <span class="text-white">{{ scope.row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Action" label="Actions" width="250" align="center">
                    <template #default="scope">
                        <div class="flex space-x-2 justify-center">
                            <el-button type="primary" size="small" class="bg-indigo-600 hover:bg-indigo-500 text-white"
                                @click="handleView(scope.row)">
                                View
                            </el-button>
                            <el-button type="danger" size="small" class="bg-red-600 hover:bg-red-500 text-white"
                                @click="handleDelete(scope.row)">
                                Delete
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTranscribeStore } from '../../store/transcribe'
import { ElMessage, ElMessageBox, vLoading } from 'element-plus'
import { useRouter } from 'vue-router'

const transcribeStore = useTranscribeStore()
const router = useRouter()
const transcribeList = computed(() => transcribeStore.transcribeList)
const isLoading = ref(false)

const getList = async () => {

    if (transcribeList.value.length) return

    isLoading.value = true
    try {
        await transcribeStore.apiGetTranscribeList()
    } catch (error) {
        ElMessage.error('Failed to load transcriptions')
    } finally {
        isLoading.value = false
    }
}

const handleView = (row: any) => {

    router.push({ path: `/transcribe/${row._id}` })

}

const handleDelete = (row: any) => {
    ElMessageBox.confirm(
        `Are you sure you want to delete "${row.title}"?`,
        'Confirm Delete',
        {
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
        .then(async () => {
            const res = await transcribeStore.apiDeleteTranscribe(row._id)
            if (res) {
                ElMessage.success('Transcription deleted successfully')
            } else {
                ElMessage.error(res.message)
            }
        })
        .catch(() => {
            ElMessage.info('Deletion cancelled')
        })
}

const tableRowClassName = () => {
    return 'custom-row'
}

onMounted(getList)
</script>

<style lang="scss">
.page {
    background: #101828;
    min-height: 100vh;
}

.list-table {
    border: none !important;

    .el-table__header-wrapper {
        background: #2a3448;

        th {
            background: #2a3448 !important;
            color: #ffffff !important;
            font-weight: 600;
            border-bottom: 1px solid #2a3448 !important;
        }
    }

    .el-table__body-wrapper {
        background: #1a2238;

        .el-table__row {
            background: #1a2238;

            td {
                color: #ffffff;
                border-bottom: 1px solid #2a3448 !important;
                border-right: none !important;
            }
        }

        .el-table__row--striped {
            background: #222b44 !important;

            td {
                background: #222b44 !important;
                border-bottom: 1px solid #2a3448 !important;
            }
        }

        .custom-row {
            transition: background-color 0.2s ease;

            &:hover {
                background: #2a3448 !important;

                td {
                    background: #2a3448 !important;
                }
            }
        }
    }

    .el-table__cell {
        border-right: none !important;
        border-left: none !important;
    }

    .el-button {
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 14px;
    }
}
</style>
