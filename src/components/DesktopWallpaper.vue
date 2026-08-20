<template>
  <div class="wallpaper" aria-hidden="true">
    <div class="wash" />
    <div class="vignette" />
  </div>
</template>

<style scoped>
.wallpaper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(160deg, #16141c 0%, #121018 50%, #15131c 100%);
}

.wash {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 18% 22%, color-mix(in oklab, #b894c8 16%, transparent), transparent 60%),
    radial-gradient(ellipse 60% 50% at 82% 18%, color-mix(in oklab, #8a96c8 14%, transparent), transparent 55%),
    radial-gradient(ellipse 55% 45% at 55% 88%, color-mix(in oklab, #6fa898 10%, transparent), transparent 55%);
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 55%, color-mix(in oklab, black 28%, transparent) 100%);
  pointer-events: none;
}
</style>
