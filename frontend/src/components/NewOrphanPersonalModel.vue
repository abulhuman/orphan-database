<template>
  <v-form ref="personalForm" v-model="validPersonalForm" lazy-validation>
    <v-container>
      <v-row class="mt-2">
        <!-- Orphan Code field -->
        <v-col cols="12" sm="6" md="3">
          <!-- <v-responsive max-width="" class=""> -->
          <v-text-field
            v-model="orphan.orphanCode"
            label="Orphan Code"
          >
          </v-text-field>
          <!-- </v-responsive> -->
        </v-col>
        <!-- Orphan Name field -->
        <v-col cols="12" sm="6" md="3">
          <!-- <v-responsive max-width="" class=""> -->
          <v-text-field
            v-model="orphan.firstName"
            :rules="[rules.required, rules.name]"
            label="Orphan Name*"
          >
          </v-text-field>
          <!-- </v-responsive> -->
        </v-col>
        <!-- Father Name field -->
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="orphan.father.firstName"
            label="Father Name*"
            :rules="[rules.required, rules.name]"
          >
          </v-text-field>
        </v-col>
        <!-- Grand Father Name field -->
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="orphan.father.lastName"
            label="Grand Father Name*"
            :rules="[rules.required, rules.name]"
          >
          </v-text-field>
        </v-col>
        <!-- Gender -->
        <v-col cols="12" sm="6" md="2">
          <v-select
            v-model="selectedOrphan.gender"
            :items="genderOptions"
            :menu-props="{ bottom: true, offsetY: true }"
            label="Gender*"
            :rules="[rules.required]"
          ></v-select>
        </v-col>
        <!-- Date of Birth field -->
        <v-col cols="12" sm="6" md="4">
          <v-menu
            ref="menu"
            v-model="orphanDateOfBirthMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="orphan.dateOfBirth"
                label="Date of Birth*"
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
                :rules="[rules.required, rules.isDate]"
              ></v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              v-model="orphan.dateOfBirth"
              no-title
              scrollable
              :max="new Date().toISOString().substr(0, 10)"
              :min="
                new Date(
                  new Date().setFullYear(
                    new Date().getFullYear() - this.ORPHAN_AGE_LIMIT
                  )
                )
                  .toISOString()
                  .substr(0, 10)
              "
              @change="orphanDateOfBirthSave"
            >
              <!-- <v-spacer></v-spacer>
                              <v-btn text color="primary" @click="menu = false">
                                Cancel
                              </v-btn>
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.menu.save(dates)"
                              >
                                OK
                              </v-btn> -->
            </v-date-picker>
          </v-menu>
        </v-col>
        <!-- Place of Birth -->
        <v-col cols="12" sm="6" md="6">
          <!-- <v-responsive max-width="" class="" style="margin-top: -11px;">
                    <v-combobox
                      v-model="orphanPlaceOfBirthSelect"
                      :items="orphanPlaceOfBirthOptions"
                      label="Place of Birth"
                      multiple
                      chips
                    >
                      <template v-slot:selection="data">
                        <v-chip
                          color="rgba(19,84,122,.5)"
                          dark
                          label
                          close
                          close-icon="mdi-close-outline"
                          v-if="data.index === 0"
                        >
                          <span>{{ data.item }}</span>
                        </v-chip>
                        <v-chip
                          color="rgba(19,84,122,.5)"
                          dark
                          label
                          close
                          close-icon="mdi-close-outline"
                          v-if="data.index === 1"
                        >
                          <span>{{ data.item }}</span>
                        </v-chip>
                        <span v-if="data.index === 2" class="grey--text caption">
                          (+{{ orphanPlaceOfBirthSelect.length - 2 }}
                          others)
                        </span>
                      </template>
                    </v-combobox>
                  </v-responsive> -->
          <v-text-field
            v-model="orphan.placeOfBirth"
            label="Place of Birth*"
            :rules="[rules.required, rules.textWithSpaces]"
          ></v-text-field>
        </v-col>
        <!-- Spoken Language(s) -->
        <v-col cols="12" sm="6" md="6">
          <!-- <v-responsive max-width="" class="" style="margin-top: -9px;">
                    <v-combobox
                      v-model="orphanSpokenLanguagesSelect"
                      :items="orphanSpokenLanguagesOptions"
                      label="Spoken Language(s)"
                      multiple
                      chips
                    >
                      <template v-slot:selection="data">
                        <v-chip
                          color="rgba(19,84,122,.5)"
                          dark
                          label
                          close
                          close-icon="mdi-close-outline"
                          v-if="data.index === 0"
                        >
                          <span>{{ data.item }}</span>
                        </v-chip>
                        <v-chip
                          color="rgba(19,84,122,.5)"
                          dark
                          label
                          close
                          close-icon="mdi-close-outline"
                          v-if="data.index === 1"
                        >
                          <span>{{ data.item }}</span>
                        </v-chip>
                        <span v-if="data.index === 2" class="grey--text caption">
                          (+{{ orphanSpokenLanguagesSelect.length - 2 }}
                          others)
                        </span>
                      </template>
                    </v-combobox>
                  </v-responsive> -->
          <v-text-field
            v-model="orphan.spokenLanguages"
            label="Spoken Language(s)*"
            :rules="[rules.required, rules.name]"
          ></v-text-field>
        </v-col>
        <!-- Religion -->
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="orphan.religion"
            :items="orphanReligionOptions"
            :menu-props="{ bottom: true, offsetY: true }"
            label="Religion*"
            :rules="[rules.required]"
          ></v-select>
        </v-col>
        <!-- Psychological Status -->
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="selectedOrphan.psychologicalStatus"
            :items="orphanPsychologicalStatusOptions"
            :menu-props="{ bottom: true, offsetY: true }"
            label="Psychological Status*"
            :rules="[rules.required]"
          ></v-select>
        </v-col>
        <!-- Health Description -->
        <v-col cols="12" sm="6" md="12">
          <v-textarea
            v-model="orphan.healthDescription"
            label="Health Description"
            auto-grow
            rows="1"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<style scoped>
/* media queries */
</style>

<script>
export default {
  props: {
    registrationDone: {
      type: Object
    },
    save: {
      type: Boolean
    },
    cancel: {
      type: Boolean
    }
  },
  data() {
    return {
      ORPHAN_AGE_LIMIT: 12,
      dialog: false,
      validPersonalForm: false,
      formHasErrors: false,
      orphan: {
        orphanCode: null,
        firstName: null,
        dateOfBirth: null,
        placeOfBirth: null,
        gender: null,
        spokenLanguages: null,
        religion: null,
        psychologicalStatus: null,
        healthDescription: null,
        father: {
          firstName: null,
          lastName: null
        }
      },
      selectedOrphan: {
        gender: null,
        psychologicalStatus: null
      },
      rules: {
        required: (value) => !!value || 'Required.',
        name: (value) => {
          const namePattern = /(^[A-z][A-Z-a-z/'.,/]+)[A-z]\s*$/g
          return namePattern.test(value) || 'Invalid name'
        },
        isDate: (value) =>
          new Date(value).toString() !== 'Invalid Date' || 'Invalid Date',
        textWithSpaces: (value) => {
          const pattern = /(^[A-z][A-Z-a-z/'.,/\s]+)[A-z]\s*$/g;
          return pattern.test(value) || !value || 'Invalid name';
        },
      },
      orphanDateOfBirthMenu: false,
      orphanReligionOptions: [
        {
          text: 'Christian',
          value: 'Christianity'
        },
        {
          text: 'Muslim',
          value: 'Islam'
        },
        {
          text: 'Christian',
          value: 'Christianity'
        },
        {
          text: 'Jewish',
          value: 'Judaism'
        },
        {
          text: 'Budhist',
          value: 'Buddhism'
        },
        {
          text: 'Hindu',
          value: 'Hinduism'
        },
        {
          text: 'Other',
          value: 'Other'
        }
      ],
      orphanPsychologicalStatusOptions: [
        'Normal',
        'Isolated',
        'Stressed',
        'Unsociable',
        'Overly Sociable'
      ],
      genderOptions: ['Male', 'Female']
    }
  },
  mounted() {},
  computed: {
    orphanSave: function() {
      return this.save
    },
    orphanCancel: function() {
      return this.cancel
    }
  },
  watch: {
    orphanSave(val) {
      if (val) this.orphanDialogNext()
    },
    orphanCancel(val) {
      if (val) this.orphanDialogCancel()
    },
    validPersonalForm(val) {
      this.$emit('personalError', val)
    },
    registrationDone(val) {
      if (val.reset) {
        this.orphanDialogReset()
      }
    },
    orphanDateOfBirthMenu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    dialog(val) {
      val || this.orphanDialogClose()
    }
  },
  methods: {
    displayOrphan() {
      console.log(this.orphan)
    },
    orphanDateOfBirthSave(date) {
      this.$refs.menu.save(date)
    },

    orphanDialogClose() {
      this.dialog = false
    },

    orphanDialogReset() {
      this.formHasErrors = false
      this.$refs.personalForm.reset()

      // $$ This gets executed after the DOM have been renderd in the next event loop what ever that means
      // this.$nextTick(() => {
      //   this.orphanItem = Object.assign({}, this.defaultItem);
      //   this.orphanIndex = -1;
      // });
    },

    orphanDialogNext() {
      this.formHasErrors = false

      if (this.$refs.personalForm.validate()) {
        this.orphan.gender = this.selectedOrphan.gender
          .slice(0, 1)
          .toUpperCase()
        this.orphan.psychologicalStatus = this.selectedOrphan.psychologicalStatus
        if (this.orphan.psychologicalStatus) {
          const words = this.orphan.psychologicalStatus.split(' ')
          this.orphan.psychologicalStatus = ''
          if (words.length > 1) {
            words.forEach((elmt) => {
              this.orphan.psychologicalStatus += elmt.toLowerCase()
            })
          } else {
            this.orphan.psychologicalStatus = words[0].toLowerCase()
          }
        }

        this.$emit('personalDone', this.orphan)
        this.$emit('personalRefs', this.$refs.personalForm)
        this.orphanDialogClose()
      } else if (!this.$refs.personalForm.validate()) {
        this.formHasErrors = true
      }
    },

    orphanDialogCancel() {
      this.orphanDialogReset()
      this.orphanDialogClose()
    }
  }
}
</script>
