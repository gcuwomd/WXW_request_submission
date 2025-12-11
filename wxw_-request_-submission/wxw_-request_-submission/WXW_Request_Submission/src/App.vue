<script setup>
import AdminLayout from '@/components/layout/AdminLayout.vue'
// import AdminLayout from '@/views/admin/AssignTask.vue'
import MemberLayout from '@/components/layout/MemberLayout.vue'
</script>

<template>
  <!-- <AdminLayout if="isAdmin">
  </AdminLayout> -->
  <MemberLayout if="isMember">
  </MemberLayout>
  <!-- <RouterLink to="/TaskList"></RouterLink>
  <RouterView /> -->
</template>

<style></style>
