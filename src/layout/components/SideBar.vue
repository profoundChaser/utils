<script setup lang="ts"></script>

<template>
  <div>
    <el-scrollbar>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>Navigator One</span>
          </template>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style scoped>

</style>
