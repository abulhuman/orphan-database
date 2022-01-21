<template>
  <v-form ref="educationForm" v-model="validEducationalForm" lazy-validation>
    <v-container>
      <v-row class="mt-2">
        <!-- Enrollment Status -->
        <v-col cols="12" sm="12" md="12">
          <v-responsive max-width="200" class="">
            <v-select
              v-model="orphanEducationEnrollmentStatus"
              :items="orphanEnrollmentStatusOptions"
              :menu-props="{
                bottom: true,
                offsetY: true
              }"
              :rules="[rules.required, rules.underAge]"
              label="Enrollment Status*"
              :readonly="disableEnrollmentStatus"
              validate-no-blur
            ></v-select>
          </v-responsive>
        </v-col>
        <!-- If Enrolled or Drop-out -->
        <template
          v-if="
            enrollmentStatusDisplay === 'Enrolled' ||
              enrollmentStatusDisplay === 'Dropout'
          "
        >
          <!-- Education Level -->
          <v-col cols="12" sm="6" md="4">
            <v-responsive max-width="270" class="">
              <v-select
                v-model="orphanEducationLevel"
                :items="orphanEducationLevelOptions"
                :menu-props="{
                  bottom: true,
                  offsetY: true
                }"
                :rules="[rules.required]"
                label="Education Level*"
              ></v-select>
            </v-responsive>
          </v-col>
          <!-- Grade/Year -->
          <v-col cols="12" sm="6" md="2">
            <v-responsive max-width="" class="">
              <v-select
                v-model="orphanEducationYear"
                :items="orphanEducationYearStateOptions"
                :menu-props="{
                  bottom: true,
                  offsetY: true
                }"
                :rules="[rules.required]"
                label="Grade/Year*"
              ></v-select>
            </v-responsive>
          </v-col>
        </template>
        <!-- If Enrolled -->
        <template v-if="enrollmentStatusDisplay === 'Enrolled'">
          <!-- School Type -->
          <v-col cols="12" sm="6" md="2">
            <v-responsive max-width="" class="">
              <v-select
                v-model="selectedOrphanTypeOfSchool"
                :items="orphanSchoolTypeOptions"
                :menu-props="{
                  bottom: true,
                  offsetY: true
                }"
                :rules="[rules.required]"
                label="School Type*"
              ></v-select>
            </v-responsive>
          </v-col>
          <!-- School/University Name -->
          <v-col cols="12" sm="6" md="4">
            <v-responsive max-width="" class="">
              <v-text-field
                v-model="orphan.educationalRecord.schoolName"
                :rules="[rules.required, rules.name]"
                label="School/University Name*"
              >
              </v-text-field>
            </v-responsive>
          </v-col>
        </template>
        <!-- If Drop-out -->
        <template v-if="enrollmentStatusDisplay === 'Dropout'">
          <!-- Reason for Drop-out -->
          <v-col cols="12" sm="12" md="6">
            <v-responsive max-width="" class="">
              <v-text-field
                v-model="orphan.educationalRecord.reason"
                :rules="[rules.required, rules.name]"
                label="Reason for dropping out*"
              >
              </v-text-field>
            </v-responsive>
          </v-col>
        </template>
        <!-- If Un-Enrolled -->
        <template v-if="enrollmentStatusDisplay === 'Unenrolled'">
          <!-- Reason for Un-Enrolled -->
          <v-col cols="12" sm="12" md="6">
            <v-responsive max-width="" class="">
              <v-text-field
                v-model="orphan.educationalRecord.reason"
                :rules="[rules.required]"
                label="Reason for not enrolling*"
                :readonly="disableEducationReason"
              >
              </v-text-field>
            </v-responsive>
          </v-col>
        </template>
        <!-- If GradeAgeMismatch -->
        <template v-if="gradeAgeMismatch">
          <v-col cols="12" sm="12" md="6">
            <v-responsive max-width="" class="">
              <v-text-field
                v-model="orphan.gradeAgeMismatchReason"
                :rules="[rules.name]"
                label="Grade-Age Mismatch Reason"
              >
              </v-text-field>
            </v-responsive>
          </v-col>
        </template>
        <!-- Hobbies -->
        <v-col cols="12" sm="12" md="6">
          <v-responsive max-width="" class="">
            <v-text-field
              v-model="orphan.hobbies"
              :rules="[rules.name]"
              label="Hobbies"
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
    updatedOrphan: {
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
      // dialog
      dialog: false,
      validEducationalForm: null,
      formHasErrors: null,
      orphan: {
        hobbies: null,
        gradeAgeMismatchReason: null,
        educationalRecord: {
          enrollmentStatus: null,
          level: null,
          year: null,
          typeOfSchool: null,
          schoolName: null,
          reason: null
        }
      },
      selectedOrphanTypeOfSchool: null,
      rules: {
        required: (value) => !!value || 'Required.',
        name: (value) => {
          const namePattern = /(^[A-z][A-Z-a-z/'.,/]+)[A-z]\s*$/g;
          return namePattern.test(value) || !value || 'Invalid name';
        },
        underAge: (value) => {
          const age =
            new Date().getFullYear() -
            new Date(this.updatedOrphan?.dateOfBirth).getFullYear();

          if (age < 4 && value !== 'Un-Enrolled') {
            return 'Orphan is not eligible for school yet';
          } else return true;
        }
      },
      gradeAgeMismatch: false,
      orphanEducationEnrollmentStatus: '',
      orphanEducationLevel: '',
      orphanEducationYear: '',
      orphanEnrollmentStatusOptions: ['Enrolled', 'Drop-Out', 'Un-Enrolled'],
      orphanSchoolTypeOptions: ['Public', 'Private'],
      orphanEducationLevelOptions: [
        'Preschool',
        'Religious Education',
        'Primary/Elementary',
        'Junior',
        'Highschool',
        'Undergraduate',
        'Postgraduate'
      ],
      orphanEducationYearStateOptions: [],
      enrollmentStatusDisplay: '',
      disableEnrollmentStatus: false,
      disableEducationReason: false
    };
  },
  beforeUpdate() {
    this.orphanAgeEligiblity();
  },
  computed: {
    orphanEducationSave: function() {
      return this.save;
    },
    orphanEducationCancel: function() {
      return this.cancel;
    }
  },
  watch: {
    orphanEducationSave(val) {
      if (val) this.educationDialogNext();
    },
    orphanEducationCancel(val) {
      if (val) this.educationDialogCancel();
    },
    validEducationalForm(val) {
      this.$emit('educationalError', val);
    },
    // show displayed boxes according to Enrollment Status
    orphanEducationEnrollmentStatus(val) {
      // clear all the fields and selects
      this.clearFields();

      if (val === 'Enrolled') {
        this.enrollmentStatusDisplay = 'Enrolled';
      } else if (val === 'Drop-Out') {
        this.enrollmentStatusDisplay = 'Dropout';
      } else if (val === 'Un-Enrolled') {
        this.enrollmentStatusDisplay = 'Unenrolled';
      }
    },

    // set the Grade/Year based on Education Level
    orphanEducationLevel(val) {
      if (val === 'Religious Education') {
        this.orphanEducationYearStateOptions = [1, 2, 3];
      } else if (val === 'Preschool') {
        this.orphanEducationYearStateOptions = [
          'Preparatory',
          'Nursery',
          'LKG',
          'UKG'
        ];
      } else if (val === 'Primary/Elementary') {
        this.orphanEducationYearStateOptions = [1, 2, 3, 4, 5, 6];
      } else if (val === 'Junior') {
        this.orphanEducationYearStateOptions = [7, 8];
      } else if (val === 'Highschool') {
        this.orphanEducationYearStateOptions = [9, 10, 11, 12];
      } else if (val === 'Undergraduate' || val === 'Postgraduate') {
        this.orphanEducationYearStateOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      }
    },
    // check the grade-age mismatch
    orphanEducationYear(val) {
      let age =
        new Date().getFullYear() -
        new Date(this.updatedOrphan?.dateOfBirth).getFullYear();

      console.log(typeof age);
      console.log(typeof this.orphanEducationLevel);
      console.log(typeof val);

      if (val !== null) {
        if (age === 4) {
          if (
            (this.orphanEducationLevel === 'Preschool' && val === 'Nursery') ||
            (this.orphanEducationLevel === 'Religious Education' && val === 1)
          ) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        } else if (age === 5) {
          if (
            (this.orphanEducationLevel === 'Preschool' && val === 'LKG') ||
            (this.orphanEducationLevel === 'Religious Education' && val === 2)
          ) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        } else if (age === 6) {
          if (
            (this.orphanEducationLevel === 'Preschool' && val === 'UKG') ||
            (this.orphanEducationLevel === 'Religious Education' && val === 3)
          ) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        } else if (age === 7) {
          if (this.orphanEducationLevel === 'Primary/Elementary' && val === 1) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        } else if (age === 8) {
          if (this.orphanEducationLevel === 'Primary/Elementary' && val === 2) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        } else if (age === 9) {
          if (this.orphanEducationLevel === 'Primary/Elementary' && val === 3) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        } else if (age === 10) {
          if (this.orphanEducationLevel === 'Primary/Elementary' && val === 4) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        } else if (age === 11) {
          if (this.orphanEducationLevel === 'Primary/Elementary' && val === 5) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        } else if (age === 12) {
          if (this.orphanEducationLevel === 'Primary/Elementary' && val === 6) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        } else if (age === 13) {
          if (this.orphanEducationLevel === 'Junior' && val === 7) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        } else if (age === 14) {
          if (this.orphanEducationLevel === 'Junior' && val === 8) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        } else if (age === 15) {
          if (this.orphanEducationLevel === 'Highschool' && val === 9) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        } else if (age === 16) {
          if (this.orphanEducationLevel === 'Highschool' && val === 10) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        } else if (age === 17) {
          if (this.orphanEducationLevel === 'Highschool' && val === 11) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        } else if (age === 18) {
          if (this.orphanEducationLevel === 'Highschool' && val === 12) {
            this.gradeAgeMismatch = false;
          } else {
            this.gradeAgeMismatch = true;
          }
        }
      }
    }
  },
  methods: {
    orphanAgeEligiblity() {
      const age =
        new Date().getFullYear() -
        new Date(this.updatedOrphan?.dateOfBirth).getFullYear();

      if (age < 3) {
        this.orphanEducationEnrollmentStatus = 'Un-Enrolled';
        this.disableEnrollmentStatus = true;
        this.orphan.educationalRecord.reason =
          'Age of orphan is not eligible for school yet';
        this.disableEducationReason = true;
      }
    },
    educationDialogClose() {
      this.dialog = false;
    },
    // set fields to null when the enrollment status changes
    clearFields() {
      this.orphanEducationLevel = null;
      this.orphanEducationYear = null;
      this.orphan.educationalRecord.typeOfSchool = null;
      this.orphan.educationalRecord.schoolName = null;
      this.orphan.educationalRecord.reason = null;
      this.orphan.hobbies = null;
    },

    educationDialogReset() {
      this.formHasErrors = false;
      this.$refs.educationForm.reset();
    },

    educationDialogNext() {
      console.log('hello');
      this.formHasErrors = false;

      if (this.$refs.educationForm.validate()) {
        if (this.orphanEducationEnrollmentStatus === 'Enrolled') {
          this.orphan.educationalRecord.enrollmentStatus = 'enrolled';
        } else if (this.orphanEducationEnrollmentStatus === 'Drop-Out') {
          this.orphan.educationalRecord.enrollmentStatus = 'droppedout';
        } else if (this.orphanEducationEnrollmentStatus === 'Un-Enrolled') {
          this.orphan.educationalRecord.enrollmentStatus = 'unenrolled';
        }

        if (this.orphanEducationLevel) {
          if (this.orphanEducationLevel === 'Religious Education') {
            this.orphan.educationalRecord.level = 'religiousEducation';
            this.orphan.educationalRecord.year = String(
              this.orphanEducationYear
            );
          } else if (this.orphanEducationLevel === 'Preschool') {
            this.orphan.educationalRecord.level = 'preSchool';
            if (this.orphanEducationYear === 'Preparatory')
              this.orphan.educationalRecord.year = String(1);
            else if (this.orphanEducationYear === 'Nursery')
              this.orphan.educationalRecord.year = String(2);
            else if (this.orphanEducationYear === 'LKG')
              this.orphan.educationalRecord.year = String(3);
            else if (this.orphanEducationYear === 'UKG')
              this.orphan.educationalRecord.year = String(4);
            else this.orphan.educationalRecord.year = String(null);
          } else if (this.orphanEducationLevel === 'Primary/Elementary') {
            this.orphan.educationalRecord.year = String(
              this.orphanEducationYear
            );
            this.orphan.educationalRecord.level = 'primary_elementary';
          } else if (this.orphanEducationLevel === 'Junior') {
            this.orphan.educationalRecord.year = String(
              this.orphanEducationYear
            );
            this.orphan.educationalRecord.level = 'junior';
          } else if (this.orphanEducationLevel === 'Highschool') {
            this.orphan.educationalRecord.year = String(
              this.orphanEducationYear
            );
            this.orphan.educationalRecord.level = 'highschool';
          } else if (this.orphanEducationLevel === 'Undergraduate') {
            this.orphan.educationalRecord.year = String(
              this.orphanEducationYear
            );
            this.orphan.educationalRecord.level = 'underGraduate';
          } else if (this.orphanEducationLevel === 'Postgraduate') {
            this.orphan.educationalRecord.level = 'postGraduate';
            this.orphan.educationalRecord.year = String(
              this.orphanEducationYear
            );
          } else {
            this.orphan.educationalRecord.level = 'N_A';
          }
        }

        this.orphan.educationalRecord.typeOfSchool = this.selectedOrphanTypeOfSchool?.toLowerCase();

        this.$emit('educationDone', this.orphan);
        this.$emit('educationRefs', this.$refs.educationForm);
        this.educationDialogClose();
      } else if (!this.$refs.educationForm.validate()) {
        this.formHasErrors = true;
      }
    },

    educationDialogCancel() {
      this.educationDialogReset();
      this.educationDialogClose();
    }
  }
};
</script>
