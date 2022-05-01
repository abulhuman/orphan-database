<template>
  <v-form ref="guardianForm" v-model="validGuardianForm" lazy-validation>
    <v-container>
      <v-row>
        <v-col sm="12">
          <div class="title mt-3 mb-n5">Guardian</div>
        </v-col>
        <!-- Guardian First Name field-->
        <v-col cols="12" sm="6" md="4">
          <v-responsive max-width="" class="">
            <v-text-field
              v-model="orphan.guardian.firstName"
              :rules="[rules.required, rules.name]"
              label="First Name*"
            >
            </v-text-field>
          </v-responsive>
        </v-col>
        <!-- Guardian Middle Name field-->
        <v-col cols="12" sm="6" md="4">
          <v-responsive max-width="" class="">
            <v-text-field
              v-model="orphan.guardian.middleName"
              :rules="[rules.required, rules.name]"
              label="Middle Name*"
            >
            </v-text-field>
          </v-responsive>
        </v-col>
        <!-- Guardian Last Name field -->
        <v-col cols="12" sm="6" md="4">
          <v-responsive max-width="" class="">
            <v-text-field
              v-model="orphan.guardian.lastName"
              :rules="[rules.required, rules.name]"
              label="Last Name*"
            >
            </v-text-field>
          </v-responsive>
        </v-col>
        <!-- Guardian Date of Birth field -->
        <v-col cols="12" sm="6" md="4">
          <v-responsive max-width="" class="">
            <v-menu
              ref="guardianDateOfBirthMenu"
              v-model="guardianDateOfBirthMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="orphan.guardian.dateOfBirth"
                  label="Date of Birth*"
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                  :rules="[rules.required, rules.isDate]"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="guardianDateOfBirthPicker"
                v-model="orphan.guardian.dateOfBirth"
                no-title
                scrollable
                :max="
                  new Date(
                    new Date().setFullYear(
                      new Date().getFullYear() - this.GUARDIAN_AGE_LIMIT
                    )
                  )
                    .toISOString()
                    .substr(0, 10)
                "
                min="1950-01-01"
                @change="guardianDateOfBirthSave"
              >
              </v-date-picker>
            </v-menu>
          </v-responsive>
        </v-col>
        <!-- Gender field -->
        <v-col cols="12" sm="6" md="2">
          <v-responsive max-width="" class="">
            <v-select
              v-model="selectedOrphan.gender"
              :items="guardianGenderOptions"
              :menu-props="{ bottom: true, offsetY: true }"
              label="Gender*"
              :rules="[rules.required]"
            ></v-select>
          </v-responsive>
        </v-col>
        <!-- TODO # add legal adoption Parents field -->
        <!-- Relation to Orphan field -->
        <v-col cols="12" sm="6" md="3">
          <v-responsive max-width="" class="">
            <v-select
              v-model="selectedOrphan.relationToOrphan"
              :items="guardianRelationToOrphanOptions"
              :menu-props="{ bottom: true, offsetY: true }"
              label="Relation to Orphan*"
              :rules="[rules.required]"
            ></v-select>
          </v-responsive>
        </v-col>
        <!-- TODO # make it a select with the data provided -->
        <!-- Guardian Job Title field -->
        <!-- <v-col cols="12" sm="6" md="3">
          <v-responsive max-width="" class="">
            <v-text-field
              v-model="orphan.guardian.jobTitle"
              :rules="[rules.name]"
              label="Job Title"
            >
            </v-text-field>
          </v-responsive>
        </v-col> -->
        <!-- TODO # -- Done -- make it a select with the data provided -->
        <!-- Guardian Nationality field -->
        <v-col cols="12" sm="6" md="2">
          <v-responsive max-width="" class="">
            <v-select
              v-model="orphan.guardian.nationality"
              :items="guardianNationalityOptions"
              :menu-props="{ bottom: true, offsetY: true }"
              label="Nationality*"
              :rules="[rules.required]"
            ></v-select>
          </v-responsive>
        </v-col>
        <!-- TODO # -- DONE -- change this field to mobile number -->
        <!-- Guardian Mobile field -->
        <v-col cols="12" sm="6" md="3">
          <v-responsive max-width="" class="">
            <v-text-field
              v-model="orphan.guardian.mobileNumber"
              placeholder="09XXXXXXXX*"
              :rules="[rules.required, rules.mobileNumber]"
              label="Mobile Phone*"
            >
            </v-text-field>
          </v-responsive>
        </v-col>
        <!-- TODO # -- DONE -- change this field to home number -->
        <!-- Guardian Telephone field -->
        <v-col cols="12" sm="6" md="3">
          <v-responsive max-width="" class="">
            <v-text-field
              v-model="orphan.guardian.telephoneNumber"
              placeholder="01XXXXXXXX"
              :rules="[rules.telephoneNumber]"
              label="Telephone"
            >
            </v-text-field>
          </v-responsive>
        </v-col>
        <!-- TODO # -- DONE -- change the Email to E-mail -->
        <!-- Guardian E-mail field -->
        <v-col cols="12" sm="6" md="4">
          <v-responsive max-width="" class="">
            <v-text-field
              v-model="orphan.guardian.email"
              type="email"
              label="E-mail*"
              :rules="[rules.required, rules.email]"
              placeholder="CDN@gmail.com"
            >
            </v-text-field>
          </v-responsive>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  props: {
    save: {
      type: Boolean
    },
    cancel: {
      type: Boolean
    }
  },
  updatedOrphan: {
    type: Object
  },

  data() {
    return {
      GUARDIAN_AGE_LIMIT: 18,
      // dialog
      dialog: false,
      validGuardianForm: false,
      formHasErrors: false,
      orphan: {
        guardian: {
          firstName: null,
          middleName: null,
          lastName: null,
          dateOfBirth: null,
          gender: null,
          relationToOrphan: null,
          nationality: null,
          mobileNumber: null,
          telephoneNumber: null,
          email: null
        }
      },
      selectedOrphan: {
        gender: null,
        relationToOrphan: null
      },
      rules: {
        required: (value) => !!value || 'Required.',
        name: (value) => {
          const namePattern = /(^[A-z][A-Z-a-z/'.,/]+)[A-z]\s*$/g;
          return namePattern.test(value) || !value || 'Invalid name';
        },
        email: (value) => {
          const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return emailPattern.test(value) || 'Invalid e-mail';
        },
        telephoneNumber: (value) => {
          const telephonePattern = /(^01[0-9]{8}$)/g;
          return telephonePattern.test(value) || !value || 'Invalid Number';
        },
        mobileNumber: (value) => {
          const mobilePattern = /^09[0-9]{8}$/g;
          return mobilePattern.test(value) || 'Invalid Number';
        },
        isDate: (value) =>
          new Date(value).toString() !== 'Invalid Date' || 'Invalid Date'
      },
      guardianDateOfBirthMenu: false,
      guardianGenderOptions: ['Male', 'Female'],
      guardianRelationToOrphanOptions: [
        'Mother',
        'Grandmother',
        'Grandfather',
        'Sister',
        'Brother',
        'Uncle',
        'Aunt',
        'Cousin',
        'Niece',
        'Nephew',
        'Legal Guardian',
        'Other'
      ],
      guardianNationalityOptions: [
        'Ethiopian',
        'Eritrean',
        'Kenyan',
        'Sudanese',
        'South_Sudanese',
        'Somali',
        'Djiboutian'
      ]

      // orphanHousingSituationSelect: [],
      // orphanHousingSituationOptions: [
      //   "Privately Owned",
      //   "Rental",
      //   "With Relative",
      //   "Dependent",
      // ],
    };
  },
  computed: {
    orphanGuardianSave: function() {
      return this.save;
    },
    orphanGuardianCancel: function() {
      return this.cancel;
    }
  },
  watch: {
    orphanGuardianSave(val) {
      if (val) this.guardianDialogNext();
    },
    orphanGuardianCancel(val) {
      if (val) this.guardianDialogCancel();
    },
    validGuardianForm(val) {
      this.$emit('guardianError', val);
    },
    guardianDateOfBirthMenu(val) {
      // Changes the active picker from the default "DATE" to "YEAR"
      val &&
        setTimeout(
          () => (this.$refs.guardianDateOfBirthPicker.activePicker = 'YEAR')
        );
    }
  },
  methods: {
    // dialog
    guardianDateOfBirthSave(date) {
      this.$refs.guardianDateOfBirthMenu.save(date);
    },
    guardianDialogClose() {
      this.dialog = false;
    },

    guardianDialogReset() {
      this.formHasErrors = false;
      this.$refs.guardianForm.reset();
    },

    guardianDialogNext() {
      this.formHasErrors = false;

      if (this.$refs.guardianForm.validate()) {
        this.orphan.guardian.gender = this.selectedOrphan.gender.slice(0, 1);

        if (this.selectedOrphan.relationToOrphan.includes(' ')) {
          this.orphan.guardian.relationToOrphan = this.selectedOrphan.relationToOrphan
            .split(' ')
            .join('');
          this.orphan.guardian.relationToOrphan =
            this.orphan.guardian.relationToOrphan.slice(0, 1).toLowerCase() +
            this.orphan.guardian.relationToOrphan.slice(1);
        } else {
          this.orphan.guardian.relationToOrphan =
            this.selectedOrphan.relationToOrphan.slice(0, 1).toLowerCase() +
            this.selectedOrphan.relationToOrphan.slice(1);
        }

        this.$emit('guardianDone', this.orphan);
        this.$emit('guardianRefs', this.$refs.guardianForm);
        this.guardianDialogClose();
      } else if (!this.$refs.guardianForm.validate()) {
        this.formHasErrors = true;
      }
    },

    guardianDialogCancel() {
      this.guardianDialogReset();
      this.guardianDialogClose();
    }
  }
};
</script>
