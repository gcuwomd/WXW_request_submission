<template>
    <div>
        <button @click="showFloatWindow = true">打开悬浮窗</button>
        <FloatWindow v-if="showFloatWindow" @close="showFloatWindow = false" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import FloatWindow from '../../views/admin/AssignTask.vue';

const showFloatWindow = ref(false);
</script>