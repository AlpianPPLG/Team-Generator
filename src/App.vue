<template>
  <div
    :class="[
      'container mx-auto p-4',
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
    ]"
  >
    <h1 class="text-3xl font-bold text-center mb-8">
      <font-awesome-icon icon="users" class="text-blue-500 mr-2" />
      Team Generator
    </h1>

    <!-- Dark Mode Toggle -->
    <div class="flex justify-end mb-4">
      <button
        @click="toggleDarkMode"
        class="bg-gray-200 p-2 rounded focus:outline-none hover:bg-gray-300"
      >
        <font-awesome-icon :icon="isDarkMode ? 'sun' : 'moon'" />
        {{ isDarkMode ? 'Mode Terang' : 'Mode Gelap' }}
      </button>
    </div>

    <!-- Add Member Component -->
    <div :class="['rounded-lg shadow-md p-6 mb-6', isDarkMode ? 'bg-gray-800' : 'bg-white']">
      <h2 class="text-xl font-bold mb-4">Tambah Anggota</h2>
      <div class="flex mb-4">
        <input
          v-model="newMember.name"
          placeholder="Nama Anggota"
          :class="[
            'border-2 p-2 rounded flex-grow mr-2',
            isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
          ]"
        />
        <input
          v-model="newMember.role"
          placeholder="Peran"
          :class="[
            'border-2 p-2 rounded flex-grow',
            isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
          ]"
        />
      </div>
      <button
        @click="addMember"
        :class="[
          'bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-200 focus:outline-none'
        ]"
      >
        <font-awesome-icon icon="plus" class="mr-2" /> Tambah Anggota
      </button>
    </div>

    <!-- Add Group Component -->
    <div :class="['rounded-lg shadow-md p-6 mb-6', isDarkMode ? 'bg-gray-800' : 'bg-white']">
      <h2 class="text-xl font-bold mb-4">Tambah Kelompok</h2>
      <input
        v-model="newGroup"
        placeholder="Nama Kelompok"
        :class="[
          'border-2 p-2 rounded w-full',
          isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
        ]"
      />
      <button
        @click="addGroup"
        :class="[
          'bg-green-500 text-white p-2 rounded w-full hover:bg-green-600 transition duration-200 focus:outline-none mt-2'
        ]"
      >
        <font-awesome-icon icon="plus" class="mr-2" /> Tambah Kelompok
      </button>
    </div>

    <!-- Generate Group Component -->
    <div :class="['rounded-lg shadow-md p-6 mb-6', isDarkMode ? 'bg-gray-800' : 'bg-white']">
      <h2 class="text-xl font-bold mb-4">Generate Kelompok</h2>
      <div class="flex space-x-2">
        <button
          @click="generateGroups"
          :class="[
            'bg-yellow-500 text-white p-3 rounded-lg w-full hover:bg-yellow-600 transition duration-200 focus:outline-none'
          ]"
        >
          <font-awesome-icon icon="random" class="mr-2" /> Generate
        </button>
        <button
          @click="startShuffling"
          v-if="!shuffleInterval"
          :class="[
            'bg-blue-500 text-white p-3 rounded-lg w-full hover:bg-blue-600 transition duration-200 focus:outline-none'
          ]"
        >
          <font-awesome-icon icon="play" class="mr-2" /> Mulai Pengacakan
        </button>
        <button
          @click="stopShuffling"
          v-else
          :class="[
            'bg-red-500 text-white p-3 rounded-lg w-full hover:bg-red-600 transition duration-200 focus:outline-none'
          ]"
        >
          <font-awesome-icon icon="stop" class="mr-2" /> Hentikan Pengacakan
        </button>
      </div>
      <div v-if="generatedGroups.length" class="mt-4">
        <h3 class="text-lg font-semibold mb-2">Hasil Generate Kelompok:</h3>
        <div
          v-for="(group, index) in generatedGroups"
          :key="index"
          :class="['rounded-lg p-4 mb-4', isDarkMode ? 'bg-gray-700' : 'bg-gray-100']"
        >
          <h4 class="font-bold text-xl mb-2">Kelompok {{ index + 1 }}</h4>
          <ul>
            <li v-for="member in group" :key="member.name" class="mb-1">
              {{ member.name }} - {{ member.role }}
            </li>
          </ul>
        </div>
        <div class="flex space-x-2 mt-4">
          <button
            @click="exportToCSV"
            class="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
          >
            Ekspor ke CSV
          </button>
          <button
            @click="exportToPDF"
            class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Ekspor ke PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Member List Component -->
    <div :class="['rounded-lg shadow-md p-6 mb-6', isDarkMode ? 'bg-gray-800' : 'bg-white']">
      <h2 class="text-xl font-bold mb-4">Daftar Anggota</h2>
      <input
        v-model="filterMember"
        placeholder="Cari Anggota"
        :class="[
          'border-2 p-2 rounded mb-4 w-full',
          isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
        ]"
      />
      <ul>
        <li
          v-for="(member, index) in filteredMembers"
          :key="index"
          class="flex justify-between items-center border-b border-gray-200 py-2"
        >
          <span>{{ member.name }} - {{ member.role }}</span>
          <div>
            <button
              @click="editMember(index)"
              class="text-yellow-500 hover:text-yellow-600 focus:outline-none mr-2"
            >
              <font-awesome-icon icon="edit" />
            </button>
            <button
              @click="removeMember(index)"
              class="text-red-500 hover:text-red-600 focus:outline-none"
            >
              <font-awesome-icon icon="trash-alt" />
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Group List Component -->
    <div :class="['rounded-lg shadow-md p-6', isDarkMode ? 'bg-gray-800' : 'bg-white']">
      <h2 class="text-xl font-bold mb-4">Daftar Kelompok</h2>
      <input
        v-model="filterGroup"
        placeholder="Cari Kelompok"
        :class="[
          'border-2 p-2 rounded mb-4 w-full',
          isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
        ]"
      />
      <ul>
        <li
          v-for="(group, index) in filteredGroups"
          :key="index"
          class="flex justify-between items-center border-b border-gray-200 py-2"
        >
          <span>{{ group }}</span>
          <button
            @click="removeGroup(index)"
            class="text-red-500 hover:text-red-600 focus:outline-none"
          >
            <font-awesome-icon icon="trash-alt" />
          </button>
        </li>
      </ul>
    </div>

    <footer :class="['text-center py-4', isDarkMode ? 'text-gray-400' : 'text-black']">
      <div class="flex justify-center space-x-4">
        <a href="https://github.com/AlpianPPLG" target="_blank" class="hover:text-gray-500">
          <font-awesome-icon :icon="['fab', 'github']" class="text-2xl" />
        </a>
        <a href="https://instagram.com/_ubermensch7" target="_blank" class="hover:text-gray-500">
          <font-awesome-icon :icon="['fab', 'instagram']" class="text-2xl" />
        </a>
      </div>
      <p class="mt-2">© 2024 Copyright. All Rights Reserved</p>
    </footer>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { saveAs } from 'file-saver'

export default {
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      newMember: { name: '', role: '' },
      newGroup: '',
      members: [],
      groups: [],
      generatedGroups: [],
      shuffleInterval: null,
      filterMember: '',
      filterGroup: '',
      isDarkMode: false // State for dark mode
    }
  },
  computed: {
    filteredMembers() {
      return this.members.filter((member) =>
        member.name.toLowerCase().includes(this.filterMember.toLowerCase())
      )
    },
    filteredGroups() {
      return this.groups.filter((group) =>
        group.toLowerCase().includes(this.filterGroup.toLowerCase())
      )
    }
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode // Toggle dark mode
    },
    addMember() {
      if (this.newMember.name && this.newMember.role) {
        this.members.push({ name: this.newMember.name, role: this.newMember.role })
        this.newMember.name = ''
        this.newMember.role = ''
        this.saveMembers()
      }
    },
    addGroup() {
      if (this.newGroup) {
        this.groups.push(this.newGroup)
        this.newGroup = ''
        this.saveGroups()
      }
    },
    generateGroups() {
      if (this.members.length && this.groups.length) {
        let shuffledMembers = this.shuffleArray(this.members.slice())
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
      this.saveMembers()
    },
    editMember(index) {
      const memberToEdit = this.members[index]
      this.newMember.name = memberToEdit.name
      this.newMember.role = memberToEdit.role
      this.removeMember(index)
    },
    removeGroup(index) {
      this.groups.splice(index, 1)
      this.saveGroups()
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
      }
      return array
    },
    saveMembers() {
      localStorage.setItem('members', JSON.stringify(this.members))
    },
    saveGroups() {
      localStorage.setItem('groups', JSON.stringify(this.groups))
    },
    loadMembers() {
      const savedMembers = localStorage.getItem('members')
      if (savedMembers) {
        this.members = JSON.parse(savedMembers)
      }
    },
    loadGroups() {
      const savedGroups = localStorage.getItem('groups')
      if (savedGroups) {
        this.groups = JSON.parse(savedGroups)
      }
    },
    checkAutoDarkMode() {
      const currentHour = new Date().getHours()
      // Mengatur mode gelap otomatis antara jam 18:00 hingga 06:00
      if (currentHour >= 18 || currentHour < 6) {
        this.isDarkMode = true
      } else {
        this.isDarkMode = false
      }
    },
    exportToCSV() {
      const csvContent = this.generatedGroups
        .map((group) => group.map((member) => `${member.name},${member.role}`).join('\n'))
        .join('\n\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      saveAs(blob, 'kelompok.csv')
    },
    exportToPDF() {
      const doc = new jsPDF()
      doc.text('Hasil Generate Kelompok', 14, 16)
      this.generatedGroups.forEach((group, index) => {
        doc.text(`Kelompok ${index + 1}`, 14, 20 + index * 30)
        const members = group.map((member) => [member.name, member.role])
        autoTable(doc, {
          head: [['Nama Anggota', 'Peran']],
          body: members,
          startY: 30 + index * 30
        })
      })
      doc.save('kelompok.pdf')
    }
  },
  mounted() {
    this.loadMembers()
    this.loadGroups()
    this.checkAutoDarkMode() // Cek dan set mode gelap otomatis saat komponen dimuat
  }
}
</script>
