<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-center mb-8">
      <font-awesome-icon icon="users" class="text-blue-500 mr-2" />
      Team Generator
    </h1>

    <!-- Add Member Component -->
    <div class="rounded-lg shadow-md bg-white p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">Tambah Anggota</h2>
      <div class="flex items-center mb-4">
        <label for="memberCount" class="mr-4">Jumlah Anggota:</label>
        <input
          id="memberCount"
          type="number"
          v-model="memberCount"
          class="border-2 border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 flex-grow w-16"
        />
      </div>
      <button
        @click="addMembers"
        class="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-200 focus:outline-none"
      >
        <font-awesome-icon icon="plus" class="mr-2" /> Tambah Anggota
      </button>
    </div>

    <!-- Add Group Component -->
    <div class="rounded-lg shadow-md bg-white p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">Tambah Kelompok</h2>
      <div class="flex items-center mb-4">
        <label for="groupCount" class="mr-4">Jumlah Kelompok:</label>
        <input
          id="groupCount"
          type="number"
          v-model="groupCount"
          class="border-2 border-gray-300 p-2 rounded focus:outline-none focus:border-green-500 flex-grow w-16"
        />
      </div>
      <button
        @click="addGroups"
        class="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600 transition duration-200 focus:outline-none"
      >
        <font-awesome-icon icon="plus" class="mr-2" /> Tambah Kelompok
      </button>
    </div>

    <!-- Generate Group Component -->
    <div class="rounded-lg shadow-md bg-white p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">Generate Kelompok</h2>
      <div class="flex space-x-2">
        <button
          @click="generateGroups"
          class="bg-yellow-500 text-white p-3 rounded-lg w-full hover:bg-yellow-600 transition duration-200 focus:outline-none"
        >
          <font-awesome-icon icon="random" class="mr-2" /> Generate
        </button>
        <button
          @click="startShuffling"
          v-if="!shuffleInterval"
          class="bg-blue-500 text-white p-3 rounded-lg w-full hover:bg-blue-600 transition duration-200 focus:outline-none"
        >
          <font-awesome-icon icon="play" class="mr-2" /> Mulai Pengacakan
        </button>
        <button
          @click="stopShuffling"
          v-else
          class="bg-red-500 text-white p-3 rounded-lg w-full hover:bg-red-600 transition duration-200 focus:outline-none"
        >
          <font-awesome-icon icon="stop" class="mr-2" /> Hentikan Pengacakan
        </button>
      </div>
      <div v-if="generatedGroups.length" class="mt-4">
        <h3 class="text-lg font-semibold mb-2">Hasil Generate Kelompok:</h3>
        <div
          v-for="(group, index) in generatedGroups"
          :key="index"
          class="rounded-lg bg-gray-100 p-4 mb-4"
        >
          <h4 class="font-bold text-xl mb-2">Kelompok {{ index + 1 }}</h4>
          <ul>
            <li v-for="member in group" :key="member" class="mb-1">{{ member }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Member List Component -->
    <div class="rounded-lg shadow-md bg-white p-6 mb-6">
      <h2 class="text-xl font-bold mb-4">Daftar Anggota</h2>
      <ul>
        <li
          v-for="(member, index) in members"
          :key="index"
          class="flex justify-between items-center border-b border-gray-200 py-2"
        >
          <span>{{ member }}</span>
          <button
            @click="removeMember(index)"
            class="text-red-500 hover:text-red-600 focus:outline-none"
          >
            <font-awesome-icon icon="trash-alt" class="mr-2" /> Hapus
          </button>
        </li>
      </ul>
    </div>

    <!-- Group List Component -->
    <div class="rounded-lg shadow-md bg-white p-6">
      <h2 class="text-xl font-bold mb-4">Daftar Kelompok</h2>
      <ul>
        <li
          v-for="(group, index) in groups"
          :key="index"
          class="flex justify-between items-center border-b border-gray-200 py-2"
        >
          <span>{{ group }}</span>
          <button
            @click="removeGroup(index)"
            class="text-red-500 hover:text-red-600 focus:outline-none"
          >
            <font-awesome-icon icon="trash-alt" class="mr-2" /> Hapus
          </button>
        </li>
      </ul>
    </div>

    <footer class="text-black text-center py-4">
      <div class="flex justify-center space-x-4">
        <a
          href="https://github.com/AlpianPPLG"
          target="_blank"
          class="text-black hover:text-gray-500"
        >
          <font-awesome-icon :icon="['fab', 'github']" class="text-2xl" />
        </a>
        <a
          href="https://instagram.com/_ubermensch7"
          target="_blank"
          class="text-black hover:text-gray-500"
        >
          <font-awesome-icon :icon="['fab', 'instagram']" class="text-2xl" />
        </a>
      </div>
      <p class="mt-2">© 2024 Copyright. All Rights Reserved</p>
    </footer>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      memberCount: 0,
      groupCount: 0,
      members: [],
      groups: [],
      generatedGroups: [],
      shuffleInterval: null
    }
  },
  methods: {
    addMembers() {
      for (let i = 0; i < this.memberCount; i++) {
        this.members.push(`Anggota ${this.members.length + 1}`)
      }
      this.memberCount = 0
    },
    addGroups() {
      for (let i = 0; i < this.groupCount; i++) {
        this.groups.push(`Kelompok ${this.groups.length + 1}`)
      }
      this.groupCount = 0
    },
    generateGroups() {
      if (this.members.length && this.groups.length) {
        let shuffledMembers = this.shuffleArray(this.members.slice()) // Make a copy to avoid mutating original
        let groups = Array.from({ length: this.groups.length }, () => [])

        shuffledMembers.forEach((member, index) => {
          groups[index % this.groups.length].push(member)
        })

        this.generatedGroups = groups
      }
    },
    startShuffling() {
      if (!this.shuffleInterval) {
        this.shuffleInterval = setInterval(this.generateGroups, 1000)
      }
    },
    stopShuffling() {
      clearInterval(this.shuffleInterval)
      this.shuffleInterval = null
    },
    removeMember(index) {
      this.members.splice(index, 1)
    },
    removeGroup(index) {
      this.groups.splice(index, 1)
    },
    shuffleArray(array) {
      // Fisher-Yates shuffle algorithm
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }
  }
}
</script>
