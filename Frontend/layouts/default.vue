<template>
    <div class="flex flex-col min-h-screen justify-between">
        <Navbar />
        <div class="flex-1">
            <slot />
        </div>
        <Footer />
    </div>
</template>
