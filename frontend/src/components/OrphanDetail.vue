<template>
  <v-dialog
    v-model="detailDialog"
    transition="dialog-bottom-transition"
    fullscreen
    persistent
    max-width="600"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-icon color="primary" v-bind="attrs" v-on="on">
        mdi-account-details
      </v-icon>
    </template>
    <template v-slot:default="dialog">
      <v-card max-width="">
        <v-toolbar dense flat>
          <!-- <span class="mx-auto">
            {{ "Name's Detail" }}
          </span> -->
          <v-spacer></v-spacer>
          <v-btn
            fab
            small
            dark
            color="red"
            class="mr-3 mt-2"
            @click="dialog.value = false"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row class="mt-0">
            <!-- First Card -->
            <v-col cols="4" class="mt-3">
              <v-card elevation="3" class="pb-md-8">
                <v-row>
                  <v-col cols="12" class="text-center">
                    <v-avatar size="100" class="mt-15">
                      <img :src="photoPortrait" alt="Orphan Photo" />
                    </v-avatar>
                  </v-col>
                  <v-col cols="12" class="py-0">
                    <div class="text-center text-h6 text-subtitle-1">
                      {{ orphanIdGenerator() }}
                    </div>
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <div class="text-center text-h6">
                      {{
                        orphan.firstName +
                          " " +
                          orphan.father.firstName +
                          " " +
                          orphan.father.lastName
                      }}
                    </div>
                  </v-col>
                  <!-- <v-col cols="12" class="py-0">
                    <div class="text-center text-subtitle-1 text--secondary">
                      {{ orphan.gender === "M" ? "Male" : "Femail" }}
                    </div>
                  </v-col> -->
                  <v-col cols="12" class="pb-0">
                    <div class="text-center text-body-1 text-capitalize">
                      {{
                        orphan.sponsorshipStatuses[
                          orphan.sponsorshipStatuses.length - 1
                        ].status
                      }}
                    </div>
                  </v-col>
                  <v-divider class="mx-6 my-6"></v-divider>
                  <v-col cols="12" class="text-center">
                    <v-btn
                      @click="toggleLongPhotoDialog"
                      width="90%"
                      color="primary"
                    >
                      View Full Photo
                    </v-btn>
                    <v-dialog v-model="longPhotoDialog">
                      <v-container>
                        <v-row>
                          <v-spacer></v-spacer>
                          <v-col class="mr-n12" sm="1">
                            <v-icon dark @click="toggleLongPhotoDialog">
                              mdi-close
                            </v-icon>
                          </v-col>
                        </v-row>
                        <v-img
                          height="82vh"
                          :src="photoLong"
                          contain
                          alt="long photo"
                        ></v-img>
                      </v-container>
                    </v-dialog>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <v-btn
                      v-if="user === 'coordinator'"
                      @click="editProfile"
                      width="90%"
                      color="blue lighten-2"
                    >
                      {{ notEditable ? "Edit" : "Save" }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <!-- Second Card -->
            <v-col cols="8">
              <v-card elevation="3">
                <!-- #TODO => add icon to the tabs -->
                <v-tabs
                  centered
                  icons-and-text
                  slider-size="3"
                  slider-color="blue lighten-2"
                >
                  <v-tab> Personal </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <v-row>
                          <!-- first Name Label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-5"
                          >
                            First Name
                          </v-col>
                          <!-- middle Name Label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-5"
                          >
                            Middle Name
                          </v-col>
                          <!-- last Name Label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-5"
                          >
                            Last Name
                          </v-col>
                          <!-- first Name textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              v-model="orphanEditableFields.orphanFirstName"
                              solo
                              :rules="[rules.name]"
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- middle Name textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanFatherFirstName
                              "
                              solo
                              :rules="[rules.name]"
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- last Name textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanFatherLastName
                              "
                              solo
                              :rules="[rules.name]"
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- gender label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Gender
                          </v-col>
                          <!-- birth Date label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Birth Date
                          </v-col>
                          <!-- birth Place label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="5"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Birth Place
                          </v-col>
                          <!-- gender textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-select
                              v-if="!notEditable"
                              :items="orphanSelectOptions.genderOptions"
                              solo
                              v-model="orphanSelectedOption.orphanGender"
                            ></v-select>
                            <v-text-field
                              v-else
                              :value="
                                genderGenerator(
                                  orphanSelectEditableFields.orphanGender
                                )
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- birth Date textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-menu
                              v-if="!notEditable"
                              ref="menu"
                              v-model="orphanDateOfBirthMenu"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="
                                    orphanSelectedDates.orphanDateOfBirth
                                  "
                                  prepend-icon="mdi-calendar"
                                  solo
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                ref="orphanDateOfBirthPicker"
                                v-model="orphanSelectedDates.orphanDateOfBirth"
                                no-title
                                scrollable
                                :max="new Date().toISOString().substr(0, 10)"
                                :min="
                                  new Date(
                                    new Date().setFullYear(
                                      new Date().getFullYear() -
                                        ORPHAN_AGE_LIMIT
                                    )
                                  )
                                    .toISOString()
                                    .substr(0, 10)
                                "
                                @change="orphanDateOfBirthSave"
                              >
                              </v-date-picker>
                            </v-menu>
                            <v-text-field
                              v-else
                              :value="dateGenerator(orphan.dateOfBirth)"
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- birth Place textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="5"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              v-model="orphanEditableFields.orphanPlaceOfBirth"
                              solo
                              :rules="[rules.name]"
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- religion label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Religion
                          </v-col>
                          <!-- spoken Language(s) label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Spoken Language(s)
                          </v-col>
                          <!-- psycological Status label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Psycological Status
                          </v-col>
                          <!-- account number label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Account Number
                          </v-col>
                          <!-- religion textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-select
                              v-if="!notEditable"
                              :items="orphanSelectOptions.orphanReligionOptions"
                              solo
                              v-model="orphanSelectedOption.orphanReligion"
                            ></v-select>
                            <v-text-field
                              v-else
                              :value="orphanSelectEditableFields.orphanReligion"
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- spoken Language(s) textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanSpokenLanguages
                              "
                              solo
                              :rules="[rules.name]"
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- psychological Status textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-select
                              v-if="!notEditable"
                              :items="
                                orphanSelectOptions.orphanPsychologicalStatusOptions
                              "
                              solo
                              no-data-text="Select Status"
                              v-model="
                                orphanSelectedOption.orphanPsychologicalStatus
                              "
                            ></v-select>
                            <v-text-field
                              v-else
                              :value="
                                orphanSelectEditableFields.orphanPsychologicalStatus
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- account number textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              v-model="orphanEditableFields.orphanAccountNumber"
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- health Description label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="12"
                            order-lg=""
                            class="pb-0 pt-0"
                          >
                            Health Description
                          </v-col>
                          <!-- health Description textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="6"
                            order-lg=""
                            class="pt-2 pb-0"
                          >
                            <v-textarea
                              v-model="
                                orphanEditableFields.orphanHealthDescription
                              "
                              :value="
                                orphanEditableFields.orphanHealthDescription
                              "
                              full-width
                              auto-grow
                              solo
                              :readonly="notEditable"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab> Education </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <v-row v-if="orphan.education !== null">
                          <!-- enrollment status label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg="first"
                            class="pb-0 pt-0"
                          >
                            Enrollment Status
                          </v-col>
                          <!-- if either Enrolled or Dropout label-->
                          <template
                            v-if="
                              orphanSelectedOption.orphanEducationEnrollmentStatus ===
                                'enrolled' ||
                                orphanSelectedOption.orphanEducationEnrollmentStatus ===
                                  'droppedout'
                            "
                            class="d-block"
                          >
                            <!-- education Level label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="1"
                              class="pb-0 pt-0"
                            >
                              Education Level
                            </v-col>
                            <!-- grade/year label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="2"
                              class="pb-0 pt-0"
                            >
                              Grade/Year
                            </v-col>
                          </template>
                          <!-- if enrolled only label-->
                          <template
                            v-if="
                              orphanSelectedOption.orphanEducationEnrollmentStatus ===
                                'enrolled'
                            "
                          >
                            <!-- school Type label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="6"
                              class="pb-0 pt-0"
                            >
                              School Type
                            </v-col>
                            <!-- school/university Name label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="7"
                              class="pb-0 pt-0"
                            >
                              School/University Name
                            </v-col>
                          </template>
                          <!-- if dropout only label-->
                          <template
                            v-if="
                              orphanSelectedOption.orphanEducationEnrollmentStatus ===
                                'droppedout'
                            "
                          >
                            <!-- reason for dropout label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="5"
                              order-lg="6"
                              class="pb-0 pt-0"
                            >
                              Reason For Dropping out
                            </v-col>
                          </template>
                          <!-- if unenrollment only label-->
                          <template
                            v-if="
                              orphanSelectedOption.orphanEducationEnrollmentStatus ===
                                'unenrolled'
                            "
                          >
                            <!-- reason for unenrollment label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="5"
                              order-lg="1"
                              class="pb-0 pt-0"
                            >
                              Reason For Unenrollment
                            </v-col>
                          </template>
                          <!-- hobbies label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg="8"
                            class="pb-0 pt-0"
                          >
                            Hobbies
                          </v-col>
                          <v-col
                            v-if="
                              orphanSelectedOption.orphanEducationEnrollmentStatus ===
                                'unenrolled'
                            "
                            lg="7"
                            order-lg="9"
                          ></v-col>

                          <!-- *********************************************************  -->

                          <!-- enrollment textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg="3"
                            class="pt-2 pb-0"
                          >
                            <v-select
                              v-if="!notEditable"
                              :items="
                                orphanSelectOptions.orphanEducationEnrollmentStatusOptions
                              "
                              solo
                              v-model="
                                orphanSelectedOption.orphanEducationEnrollmentStatus
                              "
                            ></v-select>
                            <v-text-field
                              v-else
                              :value="
                                orphanSelectEditableFields.orphanEducationEnrollmentStatus
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- if Enrolled or Dropout textfield-->
                          <template
                            v-if="
                              orphanSelectedOption.orphanEducationEnrollmentStatus ===
                                'enrolled' ||
                                orphanSelectedOption.orphanEducationEnrollmentStatus ===
                                  'droppedout'
                            "
                          >
                            <!-- education Level textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="4"
                              class="pt-2 pb-0"
                            >
                              <v-select
                                v-if="!notEditable"
                                :items="
                                  orphanSelectOptions.orphanEducationLevelOptions
                                "
                                solo
                                v-model="
                                  orphanSelectedOption.orphanEducationLevel
                                "
                                :value="
                                  orphanSelectedOption.orphanEducationLevel
                                "
                              ></v-select>
                              <v-text-field
                                v-else
                                :value="
                                  orphanSelectEditableFields.orphanEducationLevel
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- grade/year textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="5"
                              class="pt-2 pb-0"
                            >
                              <v-text-field
                                v-model="
                                  orphanEditableFields.orphanEducationYear
                                "
                                :rules="[rules.educationGrade]"
                                validate-on-blur
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                          </template>
                          <!-- if enrolled only textfield-->
                          <template
                            v-if="
                              orphanSelectedOption.orphanEducationEnrollmentStatus ===
                                'enrolled'
                            "
                          >
                            <!-- school Type textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="9"
                              class="pt-2 pb-0"
                            >
                              <v-select
                                v-if="!notEditable"
                                :items="
                                  orphanSelectOptions.orphanEducationTypeOfSchoolOptions
                                "
                                solo
                                v-model="
                                  orphanSelectedOption.orphanEducationTypeOfSchool
                                "
                              ></v-select>
                              <v-text-field
                                v-else
                                :value="
                                  orphanSelectEditableFields.orphanEducationTypeOfSchool
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- school/university Name textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="10"
                              class="pt-2 pb-0"
                            >
                              <v-text-field
                                v-model="
                                  orphanEditableFields.orphanEducationSchoolName
                                "
                                solo
                                :rules="[rules.name]"
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                          </template>
                          <!-- if dropout only textfield-->
                          <template
                            v-if="
                              orphanSelectedOption.orphanEducationEnrollmentStatus ===
                                'droppedout'
                            "
                          >
                            <!-- reason for dropout textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="5"
                              order-lg="9"
                              class="pt-2 pb-0"
                            >
                              <v-text-field
                                v-model="
                                  orphanEditableFields.orphanEducationReason
                                "
                                solo
                                :rules="[rules.name]"
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                          </template>
                          <!-- if unenrolled only textfield -->
                          <template
                            v-if="
                              orphanSelectedOption.orphanEducationEnrollmentStatus ===
                                'unenrolled'
                            "
                          >
                            <!-- reason for unenrollment textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="7"
                              order-lg="3"
                              class="pt-2 pb-0"
                            >
                              <v-text-field
                                v-model="
                                  orphanEditableFields.orphanEducationReason
                                "
                                solo
                                :rules="[rules.name]"
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                          </template>
                          <!-- hobbies textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg="last"
                            class="pt-2 pb-0"
                          >
                            <v-text-field
                              v-model="orphanEditableFields.orphanHobbies"
                              solo
                              :rules="[rules.name]"
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row v-else>
                          <!-- #TODO => finish this section with null handling  -->
                          <template class="mx-auto my-7">
                            NO EDUCATIONAL RECORD FOUND
                          </template>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <educational-records-dialog
                              :open="educationalRecordsDialog"
                              :item="orphan"
                              :isEditable="user !== 'donor'"
                              :isOrphanDetail="true"
                            />
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab> Family </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <!-- father section -->
                        <v-row v-if="orphan.father !== null">
                          <v-col cols="12" order-lg="first" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              FATHER INFORMATION
                            </v-card-subtitle>
                          </v-col>
                          <template cols="12">
                            <!-- father birth date label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="1"
                              class="pb-0 pt-0 pl-12"
                            >
                              Birth Date
                            </v-col>
                            <!-- father death date label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="2"
                              class="pb-0 pt-0"
                            >
                              Death Date
                            </v-col>
                            <!-- father cause of death label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="3"
                              class="pb-0 pt-0"
                            >
                              Cause of Death
                            </v-col>
                            <!-- ****************************************************** -->
                            <!-- father birth date textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="4"
                              class="pt-2 pb-0 pl-12"
                            >
                              <v-menu
                                v-if="!notEditable"
                                ref="fatherDateOfBirthMenu"
                                v-model="fatherDateOfBirthMenu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="
                                      orphanSelectedDates.orphanFatherDateOfBirth
                                    "
                                    prepend-icon="mdi-calendar"
                                    solo
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  ref="fatherDateOfBirthPicker"
                                  v-model="
                                    orphanSelectedDates.orphanFatherDateOfBirth
                                  "
                                  no-title
                                  scrollable
                                  :max="
                                    new Date(
                                      new Date().setFullYear(
                                        new Date().getFullYear() -
                                          FATHER_AGE_LIMIT
                                      )
                                    )
                                      .toISOString()
                                      .substr(0, 10)
                                  "
                                  min="1950-01-01"
                                  @change="fatherDateOfBirthSave"
                                >
                                </v-date-picker>
                              </v-menu>
                              <v-text-field
                                v-else
                                :value="
                                  dateGenerator(orphan.father.dateOfBirth) ||
                                    'N/A'
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- father death date textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="5"
                              class="pt-2 pb-0"
                            >
                              <v-menu
                                v-if="!notEditable"
                                ref="fatherDateOfDeathMenu"
                                v-model="fatherDateOfDeathMenu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="
                                      orphanSelectedDates.orphanFatherDateOfDeath
                                    "
                                    prepend-icon="mdi-calendar"
                                    solo
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  ref="fatherDateOfDeathPicker"
                                  v-model="
                                    orphanSelectedDates.orphanFatherDateOfDeath
                                  "
                                  no-title
                                  scrollable
                                  :max="new Date().toISOString().substr(0, 10)"
                                  :min="
                                    new Date(
                                      new Date().setFullYear(
                                        new Date().getFullYear() -
                                          FATHER_AGE_LIMIT
                                      )
                                    )
                                      .toISOString()
                                      .substr(0, 10)
                                  "
                                  @change="fatherDateOfDeathSave"
                                >
                                </v-date-picker>
                              </v-menu>
                              <v-text-field
                                v-else
                                :value="
                                  dateGenerator(orphan.father.dateOfDeath) ||
                                    'N/A'
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- father cause of death textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="6"
                              class="pt-2 pb-0"
                            >
                              <v-text-field
                                v-model="
                                  orphanEditableFields.orphanFatherCauseOfDeath
                                "
                                solo
                                :rules="[rules.name]"
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                          </template>
                        </v-row>
                        <v-row v-else>
                          <template class="mx-auto my-7">
                            NO FATHER RECORD FOUND
                          </template>
                        </v-row>
                        <!-- mother section -->
                        <v-row v-if="orphan.mother !== null">
                          <v-col cols="12" order-lg="first" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              MOTHER INFORMATION
                            </v-card-subtitle>
                          </v-col>
                          <template cols="12">
                            <!-- mother first name label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="first"
                              class="pb-0 pt-0 pl-12"
                            >
                              First Name
                            </v-col>
                            <!-- mother middle name label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="1"
                              class="pb-0 pt-0 pl-12"
                            >
                              Middle Name
                            </v-col>
                            <!-- mother last name label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="2"
                              class="pb-0 pt-0 pl-12"
                            >
                              Last Name
                            </v-col>
                            <!-- mother birth date label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="3"
                              order-lg="6"
                              class="pb-0 pt-0 pl-12"
                            >
                              Birth Date
                            </v-col>
                            <!-- mother vital Status label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="3"
                              order-lg="7"
                              class="pb-0 pt-0 pl-12"
                            >
                              Vital Status
                            </v-col>
                            <!-- if mother still alive -->
                            <template
                              v-if="
                                orphanSelectedOption.orphanMotherVitalStatus ===
                                  'alive'
                              "
                            >
                              <!-- mother marital Status label -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="8"
                                class="pb-0 pt-0 pl-12"
                              >
                                Marital Status
                              </v-col>
                              <!-- mother mobile number label -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="9"
                                class="pb-0 pt-0 pl-12"
                              >
                                Mobile Number
                              </v-col>
                            </template>
                            <!-- if mother passed away -->
                            <template
                              v-if="
                                orphanSelectedOption.orphanMotherVitalStatus ===
                                  'passed'
                              "
                            >
                              <!-- mother death date label -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="8"
                                class="pb-0 pt-0"
                              >
                                Death Date
                              </v-col>
                              <!-- mother cause of death label -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="9"
                                class="pb-0 pt-0"
                              >
                                Cause of Death
                              </v-col>
                            </template>
                            <!-- ****************************************************** -->
                            <!-- mother first name textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="3"
                              class="pt-2 pb-0 pl-12"
                            >
                              <v-text-field
                                v-model="
                                  orphanEditableFields.orphanMotherFirstName
                                "
                                solo
                                :rules="[rules.name]"
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- mother middle name textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="4"
                              class="pt-2 pb-0 pl-12"
                            >
                              <v-text-field
                                v-model="
                                  orphanEditableFields.orphanMotherMiddleName
                                "
                                solo
                                :rules="[rules.name]"
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- mother last name textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="4"
                              order-lg="5"
                              class="pt-2 pb-0 pl-12"
                            >
                              <v-text-field
                                v-model="
                                  orphanEditableFields.orphanMotherLastName
                                "
                                solo
                                :rules="[rules.name]"
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- mother birth date textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="3"
                              order-lg="10"
                              class="pt-2 pb-0 pl-12 pr-0"
                            >
                              <v-menu
                                v-if="!notEditable"
                                ref="motherDateOfBirthMenu"
                                v-model="motherDateOfBirthMenu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="
                                      orphanSelectedDates.orphanMotherDateOfBirth
                                    "
                                    prepend-icon="mdi-calendar"
                                    solo
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  ref="motherDateOfBirthPicker"
                                  v-model="
                                    orphanSelectedDates.orphanMotherDateOfBirth
                                  "
                                  no-title
                                  scrollable
                                  :max="
                                    new Date(
                                      new Date().setFullYear(
                                        new Date().getFullYear() -
                                          MOTHER_AGE_LIMIT
                                      )
                                    )
                                      .toISOString()
                                      .substr(0, 10)
                                  "
                                  min="1950-01-01"
                                  @change="motherDateOfBirthSave"
                                >
                                </v-date-picker>
                              </v-menu>
                              <v-text-field
                                v-else
                                :value="
                                  dateGenerator(orphan.mother.dateOfBirth) ||
                                    'N/A'
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- mother vital status textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="3"
                              order-lg="11"
                              class="pt-2 pb-0 pl-12"
                            >
                              <v-select
                                v-if="!notEditable"
                                :items="
                                  orphanSelectOptions.orphanMotherVitalStatusOptions
                                "
                                solo
                                v-model="
                                  orphanSelectedOption.orphanMotherVitalStatus
                                "
                              ></v-select>
                              <v-text-field
                                v-else
                                :value="
                                  orphanSelectEditableFields.orphanMotherVitalStatus
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- if mother still alive -->
                            <template
                              v-if="
                                orphanSelectedOption.orphanMotherVitalStatus ===
                                  'alive'
                              "
                            >
                              <!-- mother marital status textfield -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="12"
                                class="pt-2 pb-0 pl-12"
                              >
                                <v-select
                                  v-if="!notEditable"
                                  :items="
                                    orphanSelectOptions.orphanMotherMaritalStatusOptions
                                  "
                                  solo
                                  v-model="
                                    orphanSelectedOption.orphanMotherMaritalStatus
                                  "
                                ></v-select>
                                <v-text-field
                                  v-else
                                  :value="
                                    orphanSelectEditableFields.orphanMotherMaritalStatus
                                  "
                                  solo
                                  :readonly="notEditable"
                                ></v-text-field>
                              </v-col>
                              <!-- mother mobile number textfield -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="last"
                                class="pt-2 pb-0 pl-12"
                              >
                                <v-text-field
                                  v-model="
                                    orphanEditableFields.orphanMotherMobileNumber
                                  "
                                  solo
                                  :rules="[rules.mobileNumber]"
                                  :readonly="notEditable"
                                ></v-text-field>
                              </v-col>
                            </template>
                            <!-- if mother passed away -->
                            <template
                              v-if="
                                orphanSelectedOption.orphanMotherVitalStatus ===
                                  'passed'
                              "
                            >
                              <!-- mother death date textfield -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="12"
                                class="pt-2 pb-0"
                              >
                                <v-menu
                                  v-if="!notEditable"
                                  ref="motherDateOfDeathMenu"
                                  v-model="motherDateOfDeathMenu"
                                  :close-on-content-click="false"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="auto"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      v-model="
                                        orphanSelectedDates.orphanMotherDateOfDeath
                                      "
                                      prepend-icon="mdi-calendar"
                                      solo
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    ref="motherDateOfDeathPicker"
                                    v-model="
                                      orphanSelectedDates.orphanMotherDateOfDeath
                                    "
                                    no-title
                                    scrollable
                                    :max="
                                      new Date().toISOString().substr(0, 10)
                                    "
                                    :min="
                                      new Date(
                                        new Date().setFullYear(
                                          new Date().getFullYear() -
                                            MOTHER_AGE_LIMIT
                                        )
                                      )
                                        .toISOString()
                                        .substr(0, 10)
                                    "
                                    @change="motherDateOfDeathSave"
                                  >
                                  </v-date-picker>
                                </v-menu>
                                <v-text-field
                                  v-else
                                  :value="
                                    dateGenerator(orphan.mother.dateOfDeath) ||
                                      'N/A'
                                  "
                                  solo
                                  :readonly="notEditable"
                                ></v-text-field>
                              </v-col>
                              <!-- mother cause of death textfield -->
                              <v-col
                                cols="12"
                                sm="6"
                                lg="3"
                                order-lg="last"
                                class="pt-2 pb-0"
                              >
                                <v-text-field
                                  v-model="
                                    orphanEditableFields.orphanMotherCauseOfDeath
                                  "
                                  solo
                                  :rules="[rules.name]"
                                  :readonly="notEditable"
                                ></v-text-field>
                              </v-col>
                            </template>
                          </template>
                        </v-row>
                        <v-row v-else>
                          <template class="mx-auto my-7">
                            NO MOTHER RECORD FOUND
                          </template>
                        </v-row>
                        <!-- house property section -->
                        <v-row v-if="orphan.house_property !== null">
                          <v-col cols="12" order-lg="first" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              HOUSING INFORMATION
                            </v-card-subtitle>
                          </v-col>
                          <!-- Housing Situation label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="6"
                            order-lg="first"
                            class="pb-0 pt-0 pl-12"
                          >
                            Housing Situation
                          </v-col>
                          <!-- other property label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="6"
                            order-lg="1"
                            class="pb-0 pt-0"
                          >
                            Other Property
                          </v-col>
                          <!-- ********************************************* -->
                          <!-- housing situation textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="6"
                            order-lg="2"
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanHouse_propertyHousingSituation
                              "
                              solo
                              :rules="[rules.name]"
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- other property textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="6"
                            order-lg="last"
                            class="pt-2 pb-0"
                          >
                            <v-textarea
                              v-model="
                                orphanEditableFields.orphanHouse_propertyOtherProperty
                              "
                              solo
                              auto-grow
                              rows="1"
                              :readonly="notEditable"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                        <v-row v-else>
                          <template class="mx-auto my-7">
                            NO HOUSE-PROPERTY RECORD FOUND
                          </template>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab> Guardian </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <v-row v-if="orphan.guardian !== null">
                          <!-- guardian first name label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            First Name
                          </v-col>
                          <!-- guardian middle name label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Middle Name
                          </v-col>
                          <!-- guardian last name label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Last Name
                          </v-col>
                          <!-- guardian first name textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanGuardianFirstName
                              "
                              solo
                              :rules="[rules.name]"
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian middle name textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanGuardianMiddleName
                              "
                              solo
                              :rules="[rules.name]"
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian last name textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanGuardianLastName
                              "
                              solo
                              :rules="[rules.name]"
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian gender label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Gender
                          </v-col>
                          <!-- guardian email label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="5"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            E-mail
                          </v-col>
                          <!-- guardian mobile number label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Mobile Number
                          </v-col>
                          <!-- guardian gender textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-select
                              v-if="!notEditable"
                              :items="orphanSelectOptions.genderOptions"
                              solo
                              v-model="
                                orphanSelectedOption.orphanGuardianGender
                              "
                            ></v-select>
                            <v-text-field
                              v-else
                              :value="
                                genderGenerator(
                                  orphanSelectEditableFields.orphanGuardianGender
                                )
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian email textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="5"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="orphanEditableFields.orphanGuardianEmail"
                              solo
                              :rules="[rules.email]"
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian mobile number textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="4"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanGuardianMobileNumber
                              "
                              solo
                              :rules="[rules.mobileNumber]"
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>

                          <!-- guardian birth date label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Birth Date
                          </v-col>
                          <!-- guardian relation to orphan label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Relation to Orphan
                          </v-col>
                          <!-- guardian nationality label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Nationality
                          </v-col>
                          <!-- guardian telephone number label -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pb-0 pt-0 pl-12"
                          >
                            Telephone Number
                          </v-col>
                          <!-- guardian birth date textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0 pl-12 pr-0"
                          >
                            <v-menu
                              v-if="!notEditable"
                              ref="guardianDateOfBirthMenu"
                              v-model="guardianDateOfBirthMenu"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="
                                    orphanSelectedDates.orphanGuardianDateOfBirth
                                  "
                                  prepend-icon="mdi-calendar"
                                  solo
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                ref="guardianDateOfBirthPicker"
                                v-model="
                                  orphanSelectedDates.orphanGuardianDateOfBirth
                                "
                                no-title
                                scrollable
                                :max="
                                  new Date(
                                    new Date().setFullYear(
                                      new Date().getFullYear() -
                                        GUARDIAN_AGE_LIMIT
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
                            <v-text-field
                              v-else
                              :value="
                                dateGenerator(orphan.guardian.dateOfBirth) ||
                                  'N/A'
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian relation to orphan textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-select
                              v-if="!notEditable"
                              :items="guardianRelationToOrphan"
                              solo
                              v-model="
                                orphanSelectedOption.orphanGuardianRelationToOrphan
                              "
                            ></v-select>
                            <v-text-field
                              v-else
                              :value="
                                orphanSelectEditableFields.orphanGuardianRelationToOrphan
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian nationality textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-select
                              v-if="!notEditable"
                              :items="
                                orphanSelectOptions.orphanGuardianNationalityOptions
                              "
                              solo
                              v-model="
                                orphanSelectEditableFields.orphanGuardianNationality
                              "
                            ></v-select>
                            <v-text-field
                              v-else
                              v-model="
                                orphanSelectEditableFields.orphanGuardianNationality
                              "
                              solo
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                          <!-- guardian telephone number textfield -->
                          <v-col
                            cols="12"
                            sm="6"
                            lg="3"
                            order-lg=""
                            class="pt-2 pb-0 pl-12"
                          >
                            <v-text-field
                              v-model="
                                orphanEditableFields.orphanGuardianTelephoneNumber
                              "
                              solo
                              :rules="[rules.telephoneNumber]"
                              :readonly="notEditable"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row v-else>
                          <template class="mx-auto my-7">
                            NO GUARDIAN RECORD FOUND
                          </template>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <!-- #TODO => make one dialog to show all the documents not separate once -->
                  <v-tab> Documents </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" order-lg="" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              ORPHAN DOCUMENTS
                            </v-card-subtitle>
                          </v-col>
                          <!-- Orphan Passport -->
                          <v-col cols="4">
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img
                                    :src="orphanPassport"
                                    max-height="350px"
                                  ></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>{{
                                            notEditable
                                              ? "Passport"
                                              : "Edit Passport"
                                          }}</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            v-if="notEditable"
                                            fab
                                            color="primary"
                                            @click="toggleOrphanPassportDialog"
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                          <template v-else>
                                            <v-avatar color="primary">
                                              <v-file-input
                                                v-model="orphanPassportFile"
                                                accept="image/*"
                                                class="pl-3 pb-4"
                                                hide-input
                                                prepend-icon="mdi-file-document-edit-outline"
                                                @change="
                                                  toggleOrphanPassportInput()
                                                "
                                              >
                                              </v-file-input>
                                            </v-avatar>
                                            <v-btn
                                              color="info"
                                              fab
                                              width="48"
                                              height="48"
                                              class="ml-4"
                                              depressed
                                              @click="
                                                toggleOrphanPassportDialog
                                              "
                                            >
                                              <v-icon>
                                                mdi-file-eye-outline
                                              </v-icon>
                                            </v-btn>
                                          </template>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                            <v-dialog v-model="orphanPassportDialog">
                              <v-container>
                                <v-row>
                                  <v-spacer></v-spacer>
                                  <v-col class="pr-n12" sm="1">
                                    <v-icon
                                      dark
                                      @click="toggleOrphanPassportDialog"
                                    >
                                      mdi-close
                                    </v-icon>
                                  </v-col>
                                </v-row>
                                <v-img
                                  height="82vh"
                                  :src="orphanPassport"
                                  contain
                                  alt="long photo"
                                ></v-img>
                              </v-container>
                            </v-dialog>
                          </v-col>
                          <!-- Orphan Birth Certificate -->
                          <v-col cols="4">
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img
                                    :src="orphanBirthCertificate"
                                    max-height="350px"
                                  ></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>{{
                                            notEditable
                                              ? "Birth Certificate"
                                              : "Edit Birth Certificate"
                                          }}</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            v-if="notEditable"
                                            fab
                                            color="primary"
                                            @click="
                                              toggleOrphanBirthCertificateDialog
                                            "
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                          <template v-else>
                                            <v-avatar color="primary">
                                              <v-file-input
                                                v-model="
                                                  orphanBirthCertificateFile"
                                                accept="image/*, .pdf"
                                                class="pl-3 pb-4"
                                                hide-input
                                                prepend-icon="mdi-file-document-edit-outline"
                                                @change="
                                                  toggleOrphanBirthCertificateInput()
                                                "
                                              >
                                              </v-file-input>
                                            </v-avatar>
                                            <v-btn
                                              color="info"
                                              fab
                                              width="48"
                                              height="48"
                                              class="ml-4"
                                              depressed
                                              @click="
                                                toggleOrphanBirthCertificateDialog
                                              "
                                            >
                                              <v-icon>
                                                mdi-file-eye-outline
                                              </v-icon>
                                            </v-btn>
                                          </template>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                            <v-dialog v-model="orphanBirthCertificateDialog">
                              <v-container>
                                <v-row>
                                  <v-spacer></v-spacer>
                                  <v-col class="pr-n12" sm="1">
                                    <v-icon
                                      dark
                                      @click="
                                        toggleOrphanBirthCertificateDialog
                                      "
                                    >
                                      mdi-close
                                    </v-icon>
                                  </v-col>
                                </v-row>
                                <v-img
                                  height="82vh"
                                  :src="orphanBirthCertificate"
                                  contain
                                  alt="long photo"
                                ></v-img>
                              </v-container>
                            </v-dialog>
                          </v-col>
                          <!-- Original Thankyou Letter -->
                          <v-col cols="4">
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img
                                    v-if="skeleton"
                                    :src="originalThankyouLetter"
                                    max-height="350px"
                                  ></v-img>
                                  <v-skeleton-loader
                                    class="pt-3"
                                    v-else
                                    type="article, list-item-three-line, list-item-three-line"
                                    max-height="350px"
                                    min-height="340px"
                                    max-width="250px"
                                  >
                                  </v-skeleton-loader>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>{{
                                            notEditable
                                              ? "Thankyou Letter"
                                              : "Edit Thankyou Letter"
                                          }}</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            v-if="notEditable"
                                            fab
                                            color="primary"
                                            @click="
                                              toggleOriginalThankyouLetterDialog
                                            "
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                          <template v-else>
                                            <v-avatar color="primary">
                                              <v-file-input
                                                v-model="
                                                  originalThankyouLetterFile"
                                                accept="image/*, .pdf"
                                                class="pl-3 pb-4"
                                                hide-input
                                                prepend-icon="mdi-file-document-edit-outline"
                                                @change="
                                                  toggleOriginalThankyouLetterInput()
                                                "
                                              >
                                              </v-file-input>
                                            </v-avatar>
                                            <v-btn
                                              color="info"
                                              fab
                                              width="48"
                                              height="48"
                                              class="ml-4"
                                              depressed
                                              @click="
                                                toggleOriginalThankyouLetterDialog
                                              "
                                            >
                                              <v-icon>
                                                mdi-file-eye-outline
                                              </v-icon>
                                            </v-btn>
                                          </template>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                            <v-dialog v-model="originalThankyouLetterDialog">
                              <v-container>
                                <v-row>
                                  <v-spacer></v-spacer>
                                  <v-col class="pr-n12" sm="1">
                                    <v-icon
                                      dark
                                      @click="
                                        toggleOriginalThankyouLetterDialog
                                      "
                                    >
                                      mdi-close
                                    </v-icon>
                                  </v-col>
                                </v-row>
                                <v-img
                                  height="82vh"
                                  :src="originalThankyouLetter"
                                  contain
                                  alt="long photo"
                                ></v-img>
                              </v-container>
                            </v-dialog>
                          </v-col>
                          <!-- Orphan Id Card -->
                          <v-col cols="4">
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="160" width="250" elevation="4">
                                  <v-img
                                    :src="orphanIdCard"
                                    contain
                                    max-height="200px"
                                  ></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>{{
                                            notEditable
                                              ? "Id Card"
                                              : "Edit Id Card"
                                          }}</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            v-if="notEditable"
                                            fab
                                            color="primary"
                                            @click="toggleOrphanIdCardDialog"
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                          <template v-else>
                                            <v-avatar color="primary">
                                              <v-file-input
                                                v-model="orphanIdCardFile"
                                                accept="image/*, .pdf"
                                                class="pl-3 pb-4"
                                                hide-input
                                                prepend-icon="mdi-file-document-edit-outline"
                                                @change="
                                                  toggleOrphanIdCardInput()
                                                "
                                              >
                                              </v-file-input>
                                            </v-avatar>
                                            <v-btn
                                              color="info"
                                              fab
                                              width="48"
                                              height="48"
                                              class="ml-4"
                                              depressed
                                              @click="toggleOrphanIdCardDialog"
                                            >
                                              <v-icon>
                                                mdi-file-eye-outline
                                              </v-icon>
                                            </v-btn>
                                          </template>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                            <v-dialog v-model="orphanIdCardDialog">
                              <v-container>
                                <v-row>
                                  <v-spacer></v-spacer>
                                  <v-col class="pr-n12" sm="1">
                                    <v-icon
                                      dark
                                      @click="toggleOrphanIdCardDialog"
                                    >
                                      mdi-close
                                    </v-icon>
                                  </v-col>
                                </v-row>
                                <v-img
                                  height="82vh"
                                  :src="orphanIdCard"
                                  contain
                                  alt="long photo"
                                ></v-img>
                              </v-container>
                            </v-dialog>
                          </v-col>
                          <!-- <v-col v-if="skeleton">
                            <v-skeleton-loader
                              type="image"
                              max-height="350px"
                              min-height="340px"
                              max-width="250px"
                            >
                            </v-skeleton-loader>
                          </v-col>
                          <v-btn @click="skeleton = !skeleton">
                            click me
                          </v-btn> -->
                          <v-col cols="12">
                            <v-divider></v-divider>
                          </v-col>
                          <v-col cols="12" order-lg="" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              FATHER DOCUMENTS
                            </v-card-subtitle>
                          </v-col>
                          <!-- Father Death Certificate -->
                          <v-col cols="12">
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img
                                    :src="fatherDeathCertificate"
                                    max-height="350px"
                                  ></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>{{
                                            notEditable
                                              ? "Death Certificate"
                                              : "Edit Death Certificate"
                                          }}</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            v-if="notEditable"
                                            fab
                                            color="primary"
                                            @click="
                                              toggleFatherDeathCertificateDialog
                                            "
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                          <template v-else>
                                            <v-avatar color="primary">
                                              <v-file-input
                                                v-model="
                                                  fatherDeathCertificateFile"
                                                accept="image/*, .pdf"
                                                class="pl-3 pb-4"
                                                hide-input
                                                prepend-icon="mdi-file-document-edit-outline"
                                                @change="
                                                  toggleFatherDeathCertificateInput()
                                                "
                                              >
                                              </v-file-input>
                                            </v-avatar>
                                            <v-btn
                                              color="info"
                                              fab
                                              width="48"
                                              height="48"
                                              class="ml-4"
                                              depressed
                                              @click="
                                                toggleFatherDeathCertificateDialog
                                              "
                                            >
                                              <v-icon>
                                                mdi-file-eye-outline
                                              </v-icon>
                                            </v-btn>
                                          </template>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                            <v-dialog v-model="fatherDeathCertificateDialog">
                              <v-container>
                                <v-row>
                                  <v-spacer></v-spacer>
                                  <v-col class="pr-n12" sm="1">
                                    <v-icon
                                      dark
                                      @click="
                                        toggleFatherDeathCertificateDialog
                                      "
                                    >
                                      mdi-close
                                    </v-icon>
                                  </v-col>
                                </v-row>
                                <v-img
                                  height="82vh"
                                  :src="fatherDeathCertificate"
                                  contain
                                  alt="long photo"
                                ></v-img>
                              </v-container>
                            </v-dialog>
                          </v-col>
                          <v-col cols="12">
                            <v-divider></v-divider>
                          </v-col>
                          <v-col cols="12" order-lg="" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              GUARDIAN DOCUMENTS
                            </v-card-subtitle>
                          </v-col>
                          <!-- Guardian Confirmation Letter -->
                          <v-col cols="4">
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img
                                    :src="confirmationLetter"
                                    max-height="350px"
                                  ></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>{{
                                            notEditable
                                              ? "Confirmation Letter"
                                              : "Edit Confirmation Letter"
                                          }}</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            v-if="notEditable"
                                            fab
                                            color="primary"
                                            @click="
                                              toggleConfirmationLetterDialog
                                            "
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                          <template v-else>
                                            <v-avatar color="primary">
                                              <v-file-input
                                                v-model="confirmationLetterFile"
                                                accept="image/*, .pdf"
                                                class="pl-3 pb-4"
                                                hide-input
                                                prepend-icon="mdi-file-document-edit-outline"
                                                @change="
                                                  toggleConfirmationLetterInput()
                                                "
                                              >
                                              </v-file-input>
                                            </v-avatar>
                                            <v-btn
                                              color="info"
                                              fab
                                              width="48"
                                              height="48"
                                              class="ml-4"
                                              depressed
                                              @click="
                                                toggleConfirmationLetterDialog
                                              "
                                            >
                                              <v-icon>
                                                mdi-file-eye-outline
                                              </v-icon>
                                            </v-btn>
                                          </template>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                            <v-dialog v-model="confirmationLetterDialog">
                              <v-container>
                                <v-row>
                                  <v-spacer></v-spacer>
                                  <v-col class="pr-n12" sm="1">
                                    <v-icon
                                      dark
                                      @click="toggleConfirmationLetterDialog"
                                    >
                                      mdi-close
                                    </v-icon>
                                  </v-col>
                                </v-row>
                                <v-img
                                  height="82vh"
                                  :src="confirmationLetter"
                                  contain
                                  alt="long photo"
                                ></v-img>
                              </v-container>
                            </v-dialog>
                          </v-col>
                          <!-- Guardian Legal Confirmation Letter -->
                          <v-col cols="4">
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="350" width="250" elevation="4">
                                  <v-img
                                    :src="legalConfirmationLetter"
                                    max-height="350px"
                                  ></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>{{
                                            notEditable
                                              ? "Legal Confirmation Letter"
                                              : "Edit Legal Confirmation Letter"
                                          }}</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            v-if="notEditable"
                                            fab
                                            color="primary"
                                            @click="
                                              toggleLegalConfirmationLetterDialog
                                            "
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                          <template v-else>
                                            <v-avatar color="primary">
                                              <v-file-input
                                                v-model="
                                                  legalConfirmationLetterFile
                                                "
                                                class="pl-3 pb-4"
                                                hide-input
                                                prepend-icon="mdi-file-document-edit-outline"
                                                @change="
                                                  toggleLegalConfirmationLetterInput()
                                                "
                                              >
                                              </v-file-input>
                                            </v-avatar>
                                            <v-btn
                                              color="info"
                                              fab
                                              width="48"
                                              height="48"
                                              class="ml-4"
                                              depressed
                                              @click="
                                                toggleLegalConfirmationLetterDialog
                                              "
                                            >
                                              <v-icon>
                                                mdi-file-eye-outline
                                              </v-icon>
                                            </v-btn>
                                          </template>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                            <v-dialog v-model="legalConfirmationLetterDialog">
                              <v-container>
                                <v-row>
                                  <v-spacer></v-spacer>
                                  <v-col class="pr-n12" sm="1">
                                    <v-icon
                                      dark
                                      @click="
                                        toggleLegalConfirmationLetterDialog
                                      "
                                    >
                                      mdi-close
                                    </v-icon>
                                  </v-col>
                                </v-row>
                                <v-img
                                  height="82vh"
                                  :src="legalConfirmationLetter"
                                  contain
                                  alt="long photo"
                                ></v-img>
                              </v-container>
                            </v-dialog>
                          </v-col>
                          <!-- Guardian Id Card -->
                          <v-col cols="4">
                            <v-hover>
                              <template v-slot:default="{ hover }">
                                <v-card height="160" width="250" elevation="4">
                                  <v-img
                                    :src="guardianIdCard"
                                    max-height="200px"
                                  ></v-img>
                                  <v-fade-transition>
                                    <v-overlay v-if="hover" absolute>
                                      <v-row class="pb-6">
                                        <v-col cols="12" class="text-center">
                                          <span>{{
                                            notEditable
                                              ? " Guardian Id Card"
                                              : "Edit Guardian Id Card"
                                          }}</span>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                          <v-btn
                                            v-if="notEditable"
                                            fab
                                            color="primary"
                                            @click="toggleGuardianIdCardDialog"
                                          >
                                            <v-icon> mdi-magnify-plus </v-icon>
                                          </v-btn>
                                          <template v-else>
                                            <v-avatar color="primary">
                                              <v-file-input
                                                v-model="guardianIdCardFile"
                                                accept="image/*"
                                                class="pl-3 pb-4"
                                                hide-input
                                                prepend-icon="mdi-file-document-edit-outline"
                                                @change="
                                                  toggleGuardianIdCardInput()
                                                "
                                              >
                                              </v-file-input>
                                            </v-avatar>
                                            <v-btn
                                              color="info"
                                              fab
                                              width="48"
                                              height="48"
                                              class="ml-4"
                                              depressed
                                              @click="
                                                toggleGuardianIdCardDialog
                                              "
                                            >
                                              <v-icon>
                                                mdi-file-eye-outline
                                              </v-icon>
                                            </v-btn>
                                          </template>
                                        </v-col>
                                      </v-row>
                                    </v-overlay>
                                  </v-fade-transition>
                                </v-card>
                              </template>
                            </v-hover>
                            <v-dialog v-model="guardianIdCardDialog">
                              <v-container>
                                <v-row>
                                  <v-spacer></v-spacer>
                                  <v-col class="pr-n12" sm="1">
                                    <v-icon
                                      dark
                                      @click="toggleGuardianIdCardDialog"
                                    >
                                      mdi-close
                                    </v-icon>
                                  </v-col>
                                </v-row>
                                <v-img
                                  height="82vh"
                                  :src="guardianIdCard"
                                  contain
                                  alt="long photo"
                                ></v-img>
                              </v-container>
                            </v-dialog>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <v-tab> Other </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" order-lg="first" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              SOCIAL WORKER INFORMATION
                            </v-card-subtitle>
                          </v-col>
                          <template cols="12">
                            <!-- socialWorker fullName label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="5"
                              order-lg=""
                              class="pb-0 pt-0 pl-12"
                            >
                              Full Name
                            </v-col>
                            <!-- socialWorker gender label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="2"
                              order-lg=""
                              class="pb-0 pt-0"
                            >
                              Gender
                            </v-col>
                            <!-- socialWorker age label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="2"
                              order-lg=""
                              class="pb-0 pt-0"
                            >
                              Age
                            </v-col>
                            <!-- socialWorker mobile number label -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="3"
                              order-lg=""
                              class="pb-0 pt-0"
                            >
                              Mobile Number
                            </v-col>
                            <!-- socialWorker fullName textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="5"
                              order-lg=""
                              class="pt-2 pb-0 pl-12"
                            >
                              <v-select
                                v-if="!notEditable"
                                :items="
                                  orphanSelectOptions.orphanSocialWorkerOptions
                                "
                                solo
                                no-data-text="Select Status"
                                v-model="orphanSelectedSocialWorker"
                              ></v-select>
                              <v-text-field
                                v-else
                                :value="
                                  orphanSelectEditableFields.orphanSocialWorker
                                "
                                solo
                                :readonly="notEditable"
                              ></v-text-field>
                            </v-col>
                            <!-- socialWorker gender textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="2"
                              order-lg=""
                              class="pt-2 pb-0"
                            >
                              <v-responsive>
                                <v-text-field
                                  :value="
                                    genderGenerator(orphanSocialWorkerGender)
                                  "
                                  solo
                                  :readonly="notEditable"
                                ></v-text-field>
                              </v-responsive>
                            </v-col>
                            <!-- socialWorker age textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="2"
                              order-lg=""
                              class="pt-2 pb-0"
                            >
                              <v-responsive>
                                <v-text-field
                                  :value="
                                    ageGenerator(orphanSocialWorkerDateOfBirth)
                                  "
                                  solo
                                  :readonly="notEditable"
                                ></v-text-field>
                              </v-responsive>
                            </v-col>
                            <!-- socialWorker mobile number textfield -->
                            <v-col
                              cols="12"
                              sm="6"
                              lg="3"
                              order-lg=""
                              class="pt-2 pb-0"
                            >
                              <v-responsive>
                                <v-text-field
                                  :value="orphanSocialWorkerMobileNumber"
                                  solo
                                  :readonly="notEditable"
                                ></v-text-field>
                              </v-responsive>
                            </v-col>
                          </template>
                          <v-col cols="12" class="pt-0">
                            <v-card-subtitle class="pb-2 pt-1">
                              PHOTO HISTORY
                            </v-card-subtitle>
                          </v-col>
                          <template cols="12">
                            <!-- Orphan Photos -->
                            <!-- TODO: # make the code below show all photos in chronogical order with the year and semister shown as well -->

                            <v-col cols="12">
                              <v-card elevation="1">
                                <!-- :bench="benchedPhotos" -->
                                <v-virtual-scroll
                                  :items="orphan.photos"
                                  item-height="350"
                                  max-height="350"
                                  style="overflow-x: hidden; !important"
                                >
                                  <template v-slot:default="{ index, item }">
                                    <v-row>
                                      <!-- Portrait Photo -->
                                      <v-col cols="6">
                                        <v-list-item :key="index">
                                          <v-list-item-content
                                            v-if="item.photoPortraitUrl"
                                          >
                                            <v-hover>
                                              <template
                                                v-slot:default="{ hover }"
                                              >
                                                <v-card
                                                  height="350"
                                                  width="250"
                                                  elevation="4"
                                                >
                                                  <v-img
                                                    :src="
                                                      portraitImageGenerator(
                                                        item
                                                      )
                                                    "
                                                    max-height="350px"
                                                  ></v-img>
                                                  <v-fade-transition>
                                                    <v-overlay
                                                      v-if="hover"
                                                      absolute
                                                    >
                                                      <v-row class="pb-6">
                                                        <v-col
                                                          cols="12"
                                                          class="text-center"
                                                        >
                                                          <span>{{
                                                            notEditable
                                                              ? "Passport"
                                                              : "Edit Passport"
                                                          }}</span>
                                                        </v-col>
                                                        <v-col
                                                          cols="12"
                                                          class="text-center"
                                                        >
                                                          <v-btn
                                                            v-if="notEditable"
                                                            fab
                                                            color="primary"
                                                            @click="
                                                              toggleOrphanPortraitPhotoDialog
                                                            "
                                                          >
                                                            <v-icon>
                                                              mdi-magnify-plus
                                                            </v-icon>
                                                          </v-btn>

                                                          <!-- <template v-else>
                                                            <v-avatar color="primary">
                                                              <v-file-input
                                                                v-model="orphanPassportFile"
                                                                accept="image/*"
                                                                class="pl-3 pb-4"
                                                                hide-input
                                                                prepend-icon="mdi-file-document-edit-outline"
                                                                @change="
                                                                  toggleOrphanPassportInput()
                                                                "
                                                              >
                                                              </v-file-input>
                                                            </v-avatar>
                                                            <v-btn
                                                              color="info"
                                                              fab
                                                              width="48"
                                                              height="48"
                                                              class="ml-4"
                                                              depressed
                                                              @click="
                                                                toggleOrphanPassportDialog
                                                              "
                                                            >
                                                              <v-icon>
                                                                mdi-file-eye-outline
                                                              </v-icon>
                                                            </v-btn>
                                                          </template> -->
                                                        </v-col>
                                                      </v-row>
                                                    </v-overlay>
                                                  </v-fade-transition>
                                                </v-card>
                                              </template>
                                            </v-hover>
                                            <v-dialog
                                              v-model="
                                                orphanPortraitPhotoDialog
                                              "
                                            >
                                              <v-container>
                                                <v-row>
                                                  <v-spacer></v-spacer>
                                                  <v-col class="pr-n12" sm="1">
                                                    <v-icon
                                                      dark
                                                      @click="
                                                        toggleOrphanPortraitPhotoDialog
                                                      "
                                                    >
                                                      mdi-close
                                                    </v-icon>
                                                  </v-col>
                                                </v-row>
                                                <v-img
                                                  height="82vh"
                                                  :src="
                                                    portraitImageGenerator(item)
                                                  "
                                                  contain
                                                  alt="long photo"
                                                ></v-img>
                                              </v-container>
                                            </v-dialog>
                                          </v-list-item-content>
                                        </v-list-item>
                                      </v-col>

                                      <!-- Long Photo -->
                                      <v-col cols="6">
                                        <v-list-item :key="index">
                                          <v-list-item-content
                                            v-if="item.photoLongUrl"
                                          >
                                            <v-hover class="mb-10">
                                              <template
                                                v-slot:default="{ hover }"
                                              >
                                                <v-card
                                                  height="350"
                                                  width="250"
                                                  elevation="4"
                                                >
                                                  <v-img
                                                    :src="
                                                      longImageGenerator(item)
                                                    "
                                                    max-height="350px"
                                                  ></v-img>
                                                  <v-fade-transition>
                                                    <v-overlay
                                                      v-if="hover"
                                                      absolute
                                                    >
                                                      <v-row class="pb-6">
                                                        <v-col
                                                          cols="12"
                                                          class="text-center"
                                                        >
                                                          <span>{{
                                                            notEditable
                                                              ? "Passport"
                                                              : "Edit Passport"
                                                          }}</span>
                                                        </v-col>
                                                        <v-col
                                                          cols="12"
                                                          class="text-center"
                                                        >
                                                          <v-btn
                                                            v-if="notEditable"
                                                            fab
                                                            color="primary"
                                                            @click="
                                                              toggleOrphanLongPhotoDialog
                                                            "
                                                          >
                                                            <v-icon>
                                                              mdi-magnify-plus
                                                            </v-icon>
                                                          </v-btn>
                                                          <!-- <template v-else>
                                                            <v-avatar color="primary">
                                                              <v-file-input
                                                                v-model="orphanPassportFile"
                                                                accept="image/*"
                                                                class="pl-3 pb-4"
                                                                hide-input
                                                                prepend-icon="mdi-file-document-edit-outline"
                                                                @change="
                                                                  toggleOrphanPassportInput()
                                                                "
                                                              >
                                                              </v-file-input>
                                                            </v-avatar>
                                                            <v-btn
                                                              color="info"
                                                              fab
                                                              width="48"
                                                              height="48"
                                                              class="ml-4"
                                                              depressed
                                                              @click="
                                                                toggleOrphanPassportDialog
                                                              "
                                                            >
                                                              <v-icon>
                                                                mdi-file-eye-outline
                                                              </v-icon>
                                                            </v-btn>
                                                          </template> -->
                                                        </v-col>
                                                      </v-row>
                                                    </v-overlay>
                                                  </v-fade-transition>
                                                </v-card>
                                              </template>
                                            </v-hover>
                                            <v-dialog
                                              v-model="orphanLongPhotoDialog"
                                            >
                                              <v-container>
                                                <v-row>
                                                  <v-spacer></v-spacer>
                                                  <v-col class="pr-n12" sm="1">
                                                    <v-icon
                                                      dark
                                                      @click="
                                                        toggleOrphanLongPhotoDialog
                                                      "
                                                    >
                                                      mdi-close
                                                    </v-icon>
                                                  </v-col>
                                                </v-row>
                                                <v-img
                                                  height="82vh"
                                                  :src="
                                                    longImageGenerator(item)
                                                  "
                                                  contain
                                                  alt="long photo"
                                                ></v-img>
                                              </v-container>
                                            </v-dialog>
                                          </v-list-item-content>
                                        </v-list-item>
                                      </v-col>
                                    </v-row>
                                  </template>
                                </v-virtual-scroll>
                              </v-card>
                            </v-col>

                            <!-- <v-col cols="4">
                              <v-hover>
                                <template v-slot:default="{ hover }">
                                  <v-card height="350" width="250" elevation="4">
                                    <v-img
                                      :src="orphanPassport"
                                      max-height="350px"
                                    ></v-img>
                                    <v-fade-transition>
                                      <v-overlay v-if="hover" absolute>
                                        <v-row class="pb-6">
                                          <v-col cols="12" class="text-center">
                                            <span>{{
                                              notEditable
                                                ? "Passport"
                                                : "Edit Passport"
                                            }}</span>
                                          </v-col>
                                          <v-col cols="12" class="text-center">
                                            <v-btn
                                              v-if="notEditable"
                                              fab
                                              color="primary"
                                              @click="toggleOrphanPassportDialog"
                                            >
                                              <v-icon> mdi-magnify-plus </v-icon>
                                            </v-btn>
                                            <template v-else>
                                              <v-avatar color="primary">
                                                <v-file-input
                                                  v-model="orphanPassportFile"
                                                  accept="image/*"
                                                  class="pl-3 pb-4"
                                                  hide-input
                                                  prepend-icon="mdi-file-document-edit-outline"
                                                  @change="
                                                    toggleOrphanPassportInput()
                                                  "
                                                >
                                                </v-file-input>
                                              </v-avatar>
                                              <v-btn
                                                color="info"
                                                fab
                                                width="48"
                                                height="48"
                                                class="ml-4"
                                                depressed
                                                @click="
                                                  toggleOrphanPassportDialog
                                                "
                                              >
                                                <v-icon>
                                                  mdi-file-eye-outline
                                                </v-icon>
                                              </v-btn>
                                            </template>
                                          </v-col>
                                        </v-row>
                                      </v-overlay>
                                    </v-fade-transition>
                                  </v-card>
                                </template>
                              </v-hover>
                              <v-dialog v-model="orphanPassportDialog">
                                <v-container>
                                  <v-row>
                                    <v-spacer></v-spacer>
                                    <v-col class="pr-n12" sm="1">
                                      <v-icon
                                        dark
                                        @click="toggleOrphanPassportDialog"
                                      >
                                        mdi-close
                                      </v-icon>
                                    </v-col>
                                  </v-row>
                                  <v-img
                                    height="82vh"
                                    :src="orphanPassport"
                                    contain
                                    alt="long photo"
                                  ></v-img>
                                </v-container>
                              </v-dialog>
                            </v-col> -->
                          </template>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- <v-card-actions class="justify-end">
          <v-btn text @click="dialog.value = false">Submit</v-btn>
        </v-card-actions> -->
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped></style>

<script>
import axios from "axios";
import EducationalRecordsDialog from "@/components/EducationalRecordsDialog.vue";

// enums
const gender = ["M", "F"];
const religion = [
  "Christianity",
  "Islam",
  "Buddhism",
  "Hinduism",
  "Judaism",
  "Other",
];
const psychologicalStatus = [
  "isolated",
  "stressed",
  "unsociable",
  "overlysociable",
  "normal",
];
const enrollmentStatus = ["enrolled", "unenrolled", "droppedout"];
const type = ["private", "public", "N_A"];
const level = [
  "religiousEducation",
  "preSchool",
  "gradeSchool",
  "underGraduate",
  "postGraduate",
  "N_A",
];
const vitalStatus = ["alive", "passed"];
const maritalStatus = ["married", "widow", "N_A"];
const nationality = [
  "Djiboutian",
  "Ethiopian",
  "Eritrean",
  "Kenyan",
  "Somali",
  "South_Sudanese",
  "Sudanese",
];
const relationToOrphan = [
  "mother",
  "grandmother",
  "grandfather",
  "sister",
  "brother",
  "uncle",
  "aunt",
  "cousin",
  "niece",
  "nephew",
  "legalGuardian",
];

export default {
  components: { EducationalRecordsDialog },
  props: {
    details: {
      type: Object,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      ORPHAN_AGE_LIMIT: 12,
      FATHER_AGE_LIMIT: 15,
      MOTHER_AGE_LIMIT: 14,
      GUARDIAN_AGE_LIMIT: 18,
      // benchedPhotos: 1,
      skeleton: true,
      orphanSelectOptions: {
        genderOptions: gender,
        orphanReligionOptions: religion,
        orphanPsychologicalStatusOptions: psychologicalStatus,
        orphanEducationEnrollmentStatusOptions: enrollmentStatus,
        orphanEducationTypeOfSchoolOptions: type,
        orphanEducationLevelOptions: level,
        orphanMotherVitalStatusOptions: vitalStatus,
        orphanMotherMaritalStatusOptions: maritalStatus,
        orphanGuardianNationalityOptions: nationality,
        orphanGuardianRelationToOrphanOptions: relationToOrphan,
        orphanSocialWorkerOptions: null,
      },
      orphanSelectedOption: {
        orphanGender: "",
        orphanReligion: "",
        orphanPsychologicalStatus: "",
        orphanEducationEnrollmentStatus: "",
        orphanEducationTypeOfSchool: "",
        orphanEducationLevel: "",
        orphanMotherVitalStatus: "",
        orphanMotherMaritalStatus: "",
        orphanGuardianGender: "",
        orphanGuardianNationality: "",
        orphanGuardianRelationToOrphan: "",
      },
      orphanSelectedSocialWorker: "",
      orphanSocialWorkerGender: "",
      orphanSocialWorkerDateOfBirth: "",
      orphanSocialWorkerMobileNumber: "",
      orphanEditableFields: {
        orphanFirstName: "",
        orphanFatherFirstName: "",
        orphanFatherLastName: "",
        orphanPlaceOfBirth: "",
        orphanSpokenLanguages: "",
        orphanAccountNumber: "",
        orphanHealthDescription: "",
        orphanEducationYear: "",
        orphanEducationSchoolName: "",
        orphanEducationReason: "",
        orphanHobbies: "",
        orphanFatherCauseOfDeath: "",
        orphanMotherFirstName: "",
        orphanMotherMiddleName: "",
        orphanMotherLastName: "",
        orphanMotherMobileNumber: "",
        orphanMotherCauseOfDeath: "",
        orphanHouse_propertyHousingSituation: "",
        orphanHouse_propertyOtherProperty: "",
        orphanGuardianFirstName: "",
        orphanGuardianMiddleName: "",
        orphanGuardianLastName: "",
        orphanGuardianEmail: "",
        orphanGuardianMobileNumber: "",
        orphanGuardianTelephoneNumber: "",
      },
      orphanSelectEditableFields: {
        orphanGender: "",
        orphanReligion: "",
        orphanPsychologicalStatus: "",
        orphanEducationEnrollmentStatus: "",
        orphanEducationTypeOfSchool: "",
        orphanEducationLevel: "",
        orphanMotherVitalStatus: "",
        orphanMotherMaritalStatus: "",
        orphanGuardianGender: "",
        orphanGuardianRelationToOrphan: "",
        orphanGuardianNationality: "",
        orphanSocialWorker: "",
      },
      orphanSelectedDates: {
        orphanDateOfBirth: null,
        orphanFatherDateOfBirth: null,
        orphanFatherDateOfDeath: null,
        orphanMotherDateOfBirth: null,
        orphanMotherDateOfDeath: null,
        orphanGuardianDateOfBirth: null,
      },
      rules: {
        educationGrade: (value) => {
          if (
            this.orphanSelectedOption.orphanEducationLevel ===
              "Religious Education" &&
            value > 0 &&
            value < 4
          )
            return true;
          else if (
            this.orphanSelectedOption.orphanEducationLevel === "Preschool" &&
            value > 0 &&
            value < 4
          )
            return true;
          else if (
            this.orphanSelectedOption.orphanEducationLevel ===
              "Primary/Elementary" &&
            value > 0 &&
            value < 7
          )
            return true;
          else if (
            this.orphanSelectedOption.orphanEducationLevel === "Junior" &&
            value > 6 &&
            value < 9
          )
            return true;
          else if (
            this.orphanSelectedOption.orphanEducationLevel === "Highschool" &&
            value > 8 &&
            value < 13
          )
            return true;
          else if (
            this.orphanSelectedOption.orphanEducationLevel ===
              "Under Graduate" &&
            value > 0 &&
            value < 11
          )
            return true;
          else if (
            this.orphanSelectedOption.orphanEducationLevel ===
              "Post Graduate" &&
            value > 0 &&
            value < 11
          )
            return true;
          else if (
            this.orphanSelectedOption.orphanEducationLevel === "N_A" &&
            value === 0
          )
            return true;
          else return "Invalid Grade/Year with respect to Educational Level";
        },
        name: (value) => {
          const namePattern = /(^[A-z][A-Z-a-z/'.,/]+)[A-z]\s*$/g;
          return namePattern.test(value) || !value || "Invalid name";
        },
        email: (value) => {
          const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return emailPattern.test(value) || "Invalid e-mail";
        },
        telephoneNumber: (value) => {
          const telephonePattern = /(^01[0-9]{8}$)/g;
          return telephonePattern.test(value) || !value || "Invalid Number";
        },
        mobileNumber: (value) => {
          const mobilePattern = /^09[0-9]{8}$/g;
          return mobilePattern.test(value) || "Invalid Number";
        },
      },
      notEditable: true,
      detailDialog: false,
      dialog: false,
      orphan: null,
      orphanDateOfBirthMenu: false,
      fatherDateOfBirthMenu: false,
      fatherDateOfDeathMenu: false,
      motherDateOfBirthMenu: false,
      motherDateOfDeathMenu: false,
      guardianDateOfBirthMenu: false,
      longPhotoDialog: false,
      orphanPortraitPhotoDialog: false,
      orphanLongPhotoDialog: false,
      orphanPassportDialog: false,
      orphanPassportFile: null,
      orphanBirthCertificateDialog: false,
      orphanBirthCertificateFile: null,
      originalThankyouLetterDialog: false,
      originalThankyouLetterFile: null,
      orphanIdCardDialog: false,
      orphanIdCardFile: null,
      fatherDeathCertificateDialog: false,
      fatherDeathCertificateFile: null,
      confirmationLetterDialog: false,
      confirmationLetterFile: null,
      legalConfirmationLetterDialog: false,
      legalConfirmationLetterFile: null,
      guardianIdCardDialog: false,
      guardianIdCardFile: null,
      educationalRecordHeaders: [
        { text: "Id", value: "id" },
        { text: "Year Division", value: "yearDivision" },
      ],
      educationalRecordItems: [],
      photoPortrait: null,
      photoLong: null,
      orphanPassport: null,
      orphanBirthCertificate: null,
      originalThankyouLetter: null,
      translatedThankyouLetter: null,
      orphanIdCard: null,
      fatherDeathCertificate: null,
      guardianIdCard: null,
      confirmationLetter: null,
      legalConfirmationLetter: null,
      socialWorkers: null,
      educationalRecordsDialog: false,
    };
  },
  created() {
    this.initialize();
    this.populateFields();
    this.editableFormatter();
  },
  mounted() {},
  computed: {
    guardianRelationToOrphan() {
      if (this.orphanSelectedOption.orphanGuardianGender === "M") {
        return [
          "grandfather",
          "brother",
          "uncle",
          "cousin",
          "nephew",
          "legalGuardian",
        ];
      } else {
        return [
          "mother",
          "grandmother",
          "sister",
          "aunt",
          "cousin",
          "niece",
          "legalGuardian",
        ];
      }
    },
  },
  watch: {
    orphanDateOfBirthMenu(val) {
      val &&
        setTimeout(
          () => (this.$refs.orphanDateOfBirthPicker.activePicker = "YEAR")
        );
    },
    fatherDateOfBirthMenu(val) {
      val &&
        setTimeout(
          () => (this.$refs.fatherDateOfBirthPicker.activePicker = "YEAR")
        );
    },
    fatherDateOfDeathMenu(val) {
      val &&
        setTimeout(
          () => (this.$refs.fatherDateOfDeathPicker.activePicker = "YEAR")
        );
    },
    motherDateOfBirthMenu(val) {
      val &&
        setTimeout(
          () => (this.$refs.motherDateOfBirthPicker.activePicker = "YEAR")
        );
    },
    motherDateOfDeathMenu(val) {
      val &&
        setTimeout(
          () => (this.$refs.motherDateOfDeathPicker.activePicker = "YEAR")
        );
    },
    guardianDateOfBirthMenu(val) {
      val &&
        setTimeout(
          () => (this.$refs.guardianDateOfBirthPicker.activePicker = "YEAR")
        );
    },
  },
  methods: {
    test(index, item) {
      console.log(index);
      console.log(item);
    },
    async initialize() {
      this.orphan = this.details;
      axios
        .post("/graphql/", {
          query: `query orphan($id: ID!) {
                  orphan(id: $id) {
                    id
                    birthCertificateUrl
                    idCardUrl
                    passportUrl
                    originalThankyouLetterUrl
                    translatedThankyouLetterUrl
                    photos {
                      id
                      photoLongUrl
                      photoPortraitUrl
                    }
                  }
                }`,
          variables: {
            id: this.orphan.id,
          },
        })
        .then((res) => res.data.data.orphan)
        .then((orphan) => {
          this.orphan = Object.assign(this.orphan, orphan);

          // console.log(this.orphan)

          // do error handling and maybe notify user if needed. the code below throws a type error if any of the urls are null
          this.photoPortrait = `${axios.defaults.baseURL}${this.orphan.photos[
            this.orphan.photos.length - 1
          ]?.photoPortraitUrl.slice(
            this.orphan.photos[
              this.orphan.photos.length - 1
            ]?.photoPortraitUrl.indexOf("/")
          )}`;

          this.photoLong = `${axios.defaults.baseURL}${this.orphan.photos[
            this.orphan.photos.length - 1
          ]?.photoLongUrl?.slice(
            this.orphan.photos[
              this.orphan.photos.length - 1
            ]?.photoLongUrl?.indexOf("/")
          )}`;

          this.orphanPassport = `${
            axios.defaults.baseURL
          }${this.orphan.passportUrl.slice(
            this.orphan.passportUrl.indexOf("/")
          )}`;

          this.orphanBirthCertificate = `${
            axios.defaults.baseURL
          }${this.orphan.birthCertificateUrl.slice(
            this.orphan.birthCertificateUrl.indexOf("/")
          )}`;

          this.originalThankyouLetter = `${
            axios.defaults.baseURL
          }${this.orphan.originalThankyouLetterUrl?.slice(
            this.orphan.originalThankyouLetterUrl?.indexOf("/")
          )}`;

          this.translatedThankyouLetter = `${
            axios.defaults.baseURL
          }${this.orphan.translatedThankyouLetterUrl?.slice(
            this.orphan.translatedThankyouLetterUrl?.indexOf("/")
          )}`;

          this.orphanIdCard = `${
            axios.defaults.baseURL
          }${this.orphan.idCardUrl.slice(this.orphan.idCardUrl.indexOf("/"))}`;

          this.fatherDeathCertificate = `${
            axios.defaults.baseURL
          }${this.orphan.father?.deathCertificateUrl.slice(
            this.orphan.father?.deathCertificateUrl.indexOf("/")
          )}`;

          this.guardianIdCard = `${
            axios.defaults.baseURL
          }${this.orphan.guardian.iDCardUrl.slice(
            this.orphan.guardian.iDCardUrl.indexOf("/")
          )}`;

          this.confirmationLetter = `${
            axios.defaults.baseURL
          }${this.orphan.guardian.confirmationLetterUrl.slice(
            this.orphan.guardian.confirmationLetterUrl.indexOf("/")
          )}`;

          this.legalConfirmationLetter = `${
            axios.defaults.baseURL
          }${this.orphan.guardian?.legalConfirmationLetterUrl.slice(
            this.orphan.guardian?.legalConfirmationLetterUrl.indexOf("/")
          )}`;
        })
        .catch((err) => console.warn(err));

      // TODO: # this need to be custom for different users
      this.orphanSelectOptions.orphanSocialWorkerOptions = await axios
        .post("/graphql/", {
          query: `query {
                    allSocialWorkers {
                      id
                      firstName
                      middleName
                      lastName
                      mobileNumber
                    }
                  }`,
        })
        .then((res) => res.data.data.allSocialWorkers)
        .then((socialWorkers) => {
          this.socialWorkers = socialWorkers;
          return socialWorkers.map(
            (sociaWorker) =>
              `${sociaWorker.firstName} ${sociaWorker.middleName} ${sociaWorker.lastName}`
          );
        })
        .catch((err) => console.log(err));
    },
    populateFields() {
      this.orphanEditableFields.orphanFirstName = this.orphan.firstName;
      this.orphanEditableFields.orphanFatherFirstName = this.orphan.father.firstName;
      this.orphanEditableFields.orphanFatherLastName = this.orphan.father.lastName;
      this.orphanSelectEditableFields.orphanGender = this.orphan.gender;
      this.orphanEditableFields.orphanPlaceOfBirth = this.orphan.placeOfBirth;
      this.orphanSelectEditableFields.orphanReligion = this.orphan.religion;
      this.orphanEditableFields.orphanSpokenLanguages = this.orphan.spokenLanguages;
      this.orphanEditableFields.orphanAccountNumber = this.orphan.accountNumber;
      this.orphanSelectEditableFields.orphanPsychologicalStatus = this.orphan.psychologicalStatus;
      this.orphanEditableFields.orphanHealthDescription = this.orphan.healthDescription;
      this.orphanSelectEditableFields.orphanEducationEnrollmentStatus = this.orphan.education?.enrollmentStatus;
      this.orphanSelectEditableFields.orphanEducationTypeOfSchool = this.orphan.education?.typeOfSchool;
      this.orphanSelectEditableFields.orphanEducationLevel = this.orphan.education?.level;
      this.orphanEditableFields.orphanEducationYear = this.orphan.education?.year;
      this.orphanEditableFields.orphanEducationSchoolName = this.orphan.education?.schoolName;
      this.orphanEditableFields.orphanEducationReason = this.orphan.education?.reason;
      this.orphanEditableFields.orphanHobbies = this.orphan.hobbies;
      this.orphanEditableFields.orphanFatherCauseOfDeath = this.orphan.father.causeOfDeath;
      this.orphanEditableFields.orphanMotherFirstName = this.orphan.mother?.firstName;
      this.orphanEditableFields.orphanMotherMiddleName = this.orphan.mother?.middleName;
      this.orphanEditableFields.orphanMotherLastName = this.orphan.mother?.lastName;
      this.orphanSelectEditableFields.orphanMotherVitalStatus = this.orphan.mother?.vitalStatus;
      this.orphanSelectEditableFields.orphanMotherMaritalStatus = this.orphan.mother?.maritalStatus;
      this.orphanEditableFields.orphanMotherMobileNumber = this.orphan.mother?.mobileNumber;
      this.orphanEditableFields.orphanMotherCauseOfDeath = this.orphan.mother?.causeOfDeath;
      this.orphanEditableFields.orphanHouse_propertyHousingSituation = this.orphan.house_property?.housingSituation;
      this.orphanEditableFields.orphanHouse_propertyOtherProperty = this.orphan.house_property?.otherProperty;
      this.orphanEditableFields.orphanGuardianFirstName = this.orphan.guardian?.firstName;
      this.orphanEditableFields.orphanGuardianMiddleName = this.orphan.guardian?.middleName;
      this.orphanEditableFields.orphanGuardianLastName = this.orphan.guardian?.lastName;
      this.orphanSelectEditableFields.orphanGuardianGender = this.orphan.guardian?.gender;
      this.orphanEditableFields.orphanGuardianEmail = this.orphan.guardian?.email;
      this.orphanEditableFields.orphanGuardianMobileNumber = this.orphan.guardian?.mobileNumber;
      this.orphanSelectEditableFields.orphanGuardianRelationToOrphan = this.orphan.guardian?.relationToOrphan;
      this.orphanSelectEditableFields.orphanGuardianNationality = this.orphan.guardian?.nationality;
      this.orphanEditableFields.orphanGuardianTelephoneNumber = this.orphan.guardian?.telephoneNumber;

      this.orphanSelectedOption.orphanMotherVitalStatus = this.orphan.mother?.vitalStatus;
      this.orphanSelectedOption.orphanEducationEnrollmentStatus = this.orphan.education?.enrollmentStatus;

      if (this.orphan.socialWorker) {
        this.orphanSelectEditableFields.orphanSocialWorker = `${this.orphan.socialWorker?.firstName} ${this.orphan.socialWorker?.middleName} ${this.orphan.socialWorker?.lastName}`;
        this.orphanSocialWorkerGender = this.orphan.socialWorker?.gender;
        this.orphanSocialWorkerDateOfBirth = this.orphan.socialWorker?.dateOfBirth;
        this.orphanSocialWorkerMobileNumber = this.orphan.socialWorker?.mobileNumber;
      }
    },
    toggleLongPhotoDialog() {
      this.longPhotoDialog = !this.longPhotoDialog;
    },
    toggleOrphanPortraitPhotoDialog() {
      this.orphanPortraitPhotoDialog = !this.orphanPortraitPhotoDialog;
    },
    toggleOrphanLongPhotoDialog() {
      this.orphanLongPhotoDialog = !this.orphanLongPhotoDialog;
    },
    async editProfile() {
      this.notEditable = !this.notEditable;
      // $$ the next couple of lines are used to show the editable field on the select when being edited
      // if the fields are editable
      if (!this.notEditable) {
        // now Editable
        this.orphanSelectedOption.orphanGender = this.orphan.gender;
        this.orphanSelectedOption.orphanReligion = this.orphan.religion;
        this.orphanSelectedOption.orphanPsychologicalStatus = this.orphan.psychologicalStatus;
        this.orphanSelectedOption.orphanEducationEnrollmentStatus = this.orphan.education.enrollmentStatus;
        this.orphanSelectedOption.orphanEducationTypeOfSchool = this.orphan.education.typeOfSchool;
        // this.orphanSelectedOption.orphanEducationLevel = this.orphan.education.level;
        this.orphanSelectedOption.orphanMotherVitalStatus = this.orphan.mother.vitalStatus;
        this.orphanSelectedOption.orphanMotherMaritalStatus = this.orphan.mother.maritalStatus;
        this.orphanSelectedOption.orphanGuardianGender = this.orphan.guardian.gender;
        this.orphanSelectedOption.orphanGuardianRelationToOrphan = this.orphan.guardian.relationToOrphan;
        this.orphanSelectedOption.orphanGuardianNationality = this.orphan.guardian.nationality;
        this.orphanSelectedDates.orphanDateOfBirth = this.dashDateFormatter(
          this.orphan.dateOfBirth
        );
        this.orphanSelectedDates.orphanFatherDateOfBirth = this.dashDateFormatter(
          this.orphan.father.dateOfBirth
        );
        this.orphanSelectedDates.orphanFatherDateOfDeath = this.dashDateFormatter(
          this.orphan.father.dateOfDeath
        );
        this.orphanSelectedDates.orphanMotherDateOfBirth = this.dashDateFormatter(
          this.orphan.mother.dateOfBirth
        );
        this.orphanSelectedDates.orphanMotherDateOfDeath = this.dashDateFormatter(
          this.orphan.mother.dateOfDeath
        );
        this.orphanSelectedDates.orphanGuardianDateOfBirth = this.dashDateFormatter(
          this.orphan.guardian.dateOfBirth
        );

        this.orphanSelectedSocialWorker = `${this.orphan.socialWorker?.firstName} ${this.orphan.socialWorker?.middleName} ${this.orphan.socialWorker?.lastName}`;
      } else {
        this.copyToOrphan(this.orphan, this.orphanSelectedOption);
        this.copyToOrphan(this.orphan, this.orphanEditableFields);

        for (const key in this.orphanSelectedDates) {
          if (Object.hasOwnProperty.call(this.orphanSelectedDates, key)) {
            this.orphanSelectedDates[key] = this.isoDateFormatter(
              this.orphanSelectedDates[key]
            );
          }
        }

        this.copyToOrphan(this.orphan, this.orphanSelectedDates);

        // if (this.orphan.education.level) {
        if (this.orphan.education.level === "Religious Education") {
          this.orphan.education.level = "religiousEducation";
        } else if (this.orphan.education.level === "Preschool") {
          this.orphan.education.level = "preSchool";
        } else if (this.orphan.education.level === "Primary/Elementary") {
          this.orphan.education.level = "primary_elementary";
        } else if (this.orphan.education.level === "Junior") {
          this.orphan.education.level = "junior";
        } else if (this.orphan.education.level === "Highschool") {
          this.orphan.education.level = "highschool";
        } else if (this.orphan.education.level === "Undergraduate") {
          this.orphan.education.level = "underGraduate";
        } else if (this.orphan.education.level === "Postgraduate") {
          this.orphan.education.level = "postGraduate";
        } else {
          this.orphan.education.level = "N_A";
        }
        // }

        console.log("editedOrphan: ", this.orphan);

        let fatherUrl = {};

        if (this.fatherDeathCertificateFile) {
          const fatherDeathCertificateFormData = new FormData();
          fatherDeathCertificateFormData.append(
            "document",
            this.fatherDeathCertificateFile,
            this.fatherDeathCertificateFile.name
          );

          fatherUrl["deathCertificateUrl"] = await axios
            .post(
              `/document/`,
              fatherDeathCertificateFormData
            )
            .then((res) => res.data)
            .catch((err) => console.warn(err));
        }

        this.orphan.father.dateOfDeath = this.isoDateFormatter(
          this.orphan.father.dateOfDeath
        );
        this.orphan.father.dateOfBirth = this.isoDateFormatter(
          this.orphan.father.dateOfBirth
        );

        const updatedFather = await this.updateFather(
          this.orphan.father.id,
          this.orphan.father.firstName,
          this.orphan.father.lastName,
          this.orphan.father.dateOfBirth,
          this.orphan.father.dateOfDeath,
          this.orphan.father.causeOfDeath,
          fatherUrl
        );

        console.log(`updatedFather`, updatedFather);

        const updatedEducation = await this.updateEducation(
          this.orphan.education.id,
          this.orphan.education.enrollmentStatus,
          this.orphan.education.schoolName,
          this.orphan.education.typeOfSchool,
          this.orphan.education.year,
          this.orphan.education.level,
          this.orphan.education.reason
        );

        console.log(`updatedEducation`, updatedEducation);

        this.orphan.mother.dateOfDeath = this.isoDateFormatter(
          this.orphan.mother.dateOfDeath
        );
        this.orphan.mother.dateOfBirth = this.isoDateFormatter(
          this.orphan.mother.dateOfBirth
        );

        const updatedMother = await this.updateMother(
          this.orphan.mother.id,
          this.orphan.mother.firstName,
          this.orphan.mother.middleName,
          this.orphan.mother.lastName,
          this.orphan.mother.vitalStatus,
          this.orphan.mother.dateOfBirth,
          this.orphan.mother.dateOfDeath,
          this.orphan.mother.causeOfDeath,
          this.orphan.mother.maritalStatus,
          this.orphan.mother.mobileNumber
        );

        console.log(`updatedMother`, updatedMother);

        const updatedHouseProperty = await this.updateHouseProperty(
          this.orphan.house_property.id,
          this.orphan.house_property.housingSituation,
          this.orphan.house_property.otherProperty
        );

        console.log(`updatedHouseProperty`, updatedHouseProperty);

        let guardianUrls = {};

        if (this.confirmationLetterFile) {
          const guardianConfirmationLetterFormData = new FormData();
          guardianConfirmationLetterFormData.append(
            "document",
            this.confirmationLetterFile,
            this.confirmationLetterFile.name
          );

          guardianUrls["confirmationLetterUrl"] = await axios
            .post(
              `/document/`,
              guardianConfirmationLetterFormData
            )
            .then((res) => res.data)
            .catch((err) => console.warn(err));
        }

        if (this.legalConfirmationLetterFile) {
          const guardianLegalConfirmationLetterFormData = new FormData();
          guardianLegalConfirmationLetterFormData.append(
            "document",
            this.legalConfirmationLetterFile,
            this.legalConfirmationLetterFile.name
          );

          guardianUrls["legalConfirmationLetterUrl"] = await axios
            .post(
              `/document/`,
              guardianLegalConfirmationLetterFormData
            )
            .then((res) => res.data)
            .catch((err) => console.warn(err));
        }

        if (this.guardianIdCardFile) {
          const guardianIdCardFormData = new FormData();
          guardianIdCardFormData.append(
            "document",
            this.guardianIdCardFile,
            this.guardianIdCardFile.name
          );

          guardianUrls["iDCardUrl"] = await axios
            .post(`/document/`, guardianIdCardFormData)
            .then((res) => res.data)
            .catch((err) => console.warn(err));
        }

        this.orphan.guardian.dateOfBirth = this.isoDateFormatter(
          this.orphan.guardian.dateOfBirth
        );

        const updatedGuardian = await this.updateGuardian(
          this.orphan.guardian.id,
          this.orphan.guardian.firstName,
          this.orphan.guardian.middleName,
          this.orphan.guardian.lastName,
          this.orphan.guardian.gender,
          this.orphan.guardian.dateOfBirth,
          this.orphan.guardian.relationToOrphan,
          this.orphan.guardian.email,
          this.orphan.guardian.mobileNumber,
          this.orphan.guardian.telephoneNumber,
          this.orphan.guardian.nationality,
          guardianUrls
        );

        const updatedSocialWorker = this.socialWorkers.filter(
          (socialWorker) =>
            this.orphanSelectedSocialWorker ===
            `${socialWorker.firstName} ${socialWorker.middleName} ${socialWorker.lastName}`
        )[0];

        console.log(`updatedGuardian`, updatedGuardian);

        let orphanUrls = {};

        if (this.orphanBirthCertificateFile) {
          const orphanBirthCertificateFormData = new FormData();
          orphanBirthCertificateFormData.append(
            "document",
            this.orphanBirthCertificateFile,
            this.orphanBirthCertificateFile.name
          );

          orphanUrls["birthCertificateUrl"] = await axios
            .post(
              `/document/`,
              orphanBirthCertificateFormData
            )
            .then((res) => res.data)
            .catch((err) => console.warn(err));
        }

        if (this.orphanIdCardFile) {
          const orphanIdCardFormData = new FormData();
          orphanIdCardFormData.append(
            "document",
            this.orphanIdCardFile,
            this.orphanIdCardFile.name
          );

          orphanUrls["idCardUrl"] = await axios
            .post(`/document/`, orphanIdCardFormData)
            .then((res) => res.data)
            .catch((err) => console.warn(err));
        }

        if (this.orphanPassportFile) {
          const orphanPassportFormData = new FormData();
          orphanPassportFormData.append(
            "document",
            this.orphanPassportFile,
            this.orphanPassportFile.name
          );

          orphanUrls["passportUrl"] = await axios
            .post(`/document/`, orphanPassportFormData)
            .then((res) => res.data)
            .catch((err) => console.warn(err));
        }

        if (this.originalThankyouLetterFile) {
          const originalThankyouLetterFormData = new FormData();
          originalThankyouLetterFormData.append(
            "document",
            this.originalThankyouLetterFile,
            this.originalThankyouLetterFile.name
          );

          orphanUrls["originalThankyouLetterUrl"] = await axios
            .post(
              `/document/`,
              originalThankyouLetterFormData
            )
            .then((res) => res.data)
            .catch((err) => console.warn(err));
        }

        const updatedOrphan = await this.updateOrphan(
          this.orphan.id,
          this.orphan.firstName,
          this.orphan.gender,
          this.orphan.placeOfBirth,
          this.orphan.dateOfBirth,
          this.orphan.spokenLanguages,
          this.orphan.gradeAgeMismatchReason,
          this.orphan.hobbies,
          this.orphan.religion,
          this.orphan.healthDescription,
          this.orphan.psychologicalStatus,
          this.orphan.accountNumber,
          updatedEducation.id,
          updatedFather.id,
          updatedMother.id,
          updatedGuardian.id,
          updatedHouseProperty.id,
          updatedSocialWorker.id,
          null, // photosIds
          orphanUrls
        );

        this.orphan = Object.assign(this.orphan, updatedOrphan);
        this.populateFields();

        console.log(`updatedOrphan`, updatedOrphan);
      }
      this.educationLevelFormatter();
    },
    updateFather(
      fatherId,
      firstName,
      lastName,
      dateOfBirth,
      dateOfDeath,
      causeOfDeath,
      fatherUrl
    ) {
      let queryParameterInjection = "",
        query$ParameterInjection = "";
      for (const url in fatherUrl) {
        if (url !== "") {
          query$ParameterInjection += ` $${url}: String`;
          queryParameterInjection += ` ${url}: $${url}`;
        }
      }

      let query = `mutation updateFather(
        $id: ID!
        $firstName: String
        $lastName: String
        $dateOfBirth: DateTime
        $dateOfDeath: DateTime
        $causeOfDeath: String
        ${query$ParameterInjection}
      ) {
        updateFather(
          id: $id
          firstName: $firstName
          lastName: $lastName
          dateOfBirth: $dateOfBirth
          dateOfDeath: $dateOfDeath
          causeOfDeath: $causeOfDeath
          ${queryParameterInjection}
        ) {
          id
        }
      }`;

      let variables = {
        id: fatherId,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        dateOfDeath: dateOfDeath,
        causeOfDeath: causeOfDeath,
      };
      variables = Object.assign(variables, fatherUrl);

      return axios
        .post("/graphql/", {
          query: query,
          variables: variables,
        })
        .then((res) => res.data.data.updateFather)
        .catch((err) => console.warn(err));
    },

    updateEducation(
      educationId,
      enrollmentStatus,
      schoolName,
      typeOfSchool,
      year,
      level,
      reason
    ) {
      return axios
        .post("/graphql/", {
          query: `mutation updateEducation(
                  $id: ID!
                  $enrollmentStatus: educationEnrollmentStatus
                  $schoolName: String
                  $typeOfSchool: educationTypeOfSchool
                  $year: String
                  $level: educationLevel
                  $reason: String
                ) {
                  updateEducation(
                    id: $id
                    enrollmentStatus: $enrollmentStatus
                    schoolName: $schoolName
                    typeOfSchool: $typeOfSchool
                    year: $year
                    level: $level
                    reason: $reason
                  ) {
                    id
                  }
                }`,
          variables: {
            id: educationId,
            enrollmentStatus: enrollmentStatus,
            schoolName: schoolName,
            typeOfSchool: typeOfSchool,
            year: year,
            level: level,
            reason: reason,
          },
        })
        .then((res) => res.data.data.updateEducation)
        .catch((err) => console.warn(err));
    },

    updateGuardian(
      guardianId,
      firstName,
      middleName,
      lastName,
      gender,
      dateOfBirth,
      relationToOrphan,
      email,
      mobileNumber,
      telephoneNumber,
      nationality,
      guardianUrls
    ) {
      let queryParameterInjection = "",
        query$ParameterInjection = "";
      for (const url in guardianUrls) {
        if (url !== "") {
          query$ParameterInjection += ` $${url}: String`;
          queryParameterInjection += ` ${url}: $${url}`;
        }
      }

      let query = `mutation updateGuardian(
        $id: ID!
        $firstName: String
        $middleName: String
        $lastName: String
        $gender: guardianGender
        $dateOfBirth: DateTime
        $relationToOrphan: guardianRelationToOrphan
        $email: String
        $mobileNumber: String
        $telephoneNumber: String
        $nationality: guardianNationality
        ${query$ParameterInjection}
      ) {
        updateGuardian(
          id: $id
          firstName: $firstName
          middleName: $middleName
          lastName: $lastName
          gender: $gender
          dateOfBirth: $dateOfBirth
          relationToOrphan: $relationToOrphan
          email: $email
          mobileNumber: $mobileNumber
          telephoneNumber: $telephoneNumber
          nationality: $nationality
          ${queryParameterInjection}
        ) {
          id
        }
      }`;

      let variables = {
        id: guardianId,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        gender: gender,
        dateOfBirth: dateOfBirth,
        relationToOrphan: relationToOrphan,
        email: email,
        mobileNumber: mobileNumber,
        telephoneNumber: telephoneNumber,
        nationality: nationality,
      };
      variables = Object.assign(variables, guardianUrls);

      return axios
        .post("/graphql/", {
          query: query,
          variables: variables,
        })
        .then((res) => res.data.data.updateGuardian)
        .catch((err) => console.warn(err));
    },

    updateMother(
      motherId,
      firstName,
      middleName,
      lastName,
      vitalStatus,
      dateOfBirth,
      dateOfDeath,
      causeOfDeath,
      maritalStatus,
      mobileNumber
    ) {
      return axios
        .post("/graphql/", {
          query: `mutation updateMother(
                  $id: ID!
                  $firstName: String
                  $middleName: String
                  $lastName: String
                  $vitalStatus: motherVitalStatus
                  $dateOfBirth: DateTime
                  $dateOfDeath: DateTime
                  $causeOfDeath: String
                  $mobileNumber: String
                  $maritalStatus: motherMaritalStatus
                ) {
                  updateMother(
                    id: $id
                    firstName: $firstName
                    middleName: $middleName
                    lastName: $lastName
                    vitalStatus: $vitalStatus
                    dateOfBirth: $dateOfBirth
                    dateOfDeath: $dateOfDeath
                    causeOfDeath: $causeOfDeath
                    mobileNumber: $mobileNumber
                    maritalStatus: $maritalStatus
                  ) {
                    id
                  }
                }`,
          variables: {
            id: parseInt(motherId),
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            vitalStatus: vitalStatus,
            dateOfBirth: dateOfBirth,
            dateOfDeath: dateOfDeath,
            causeOfDeath: causeOfDeath || null,
            mobileNumber: mobileNumber,
            maritalStatus: maritalStatus,
          },
        })
        .then((res) => res.data.data.updateMother)
        .catch((err) => console.warn(err));
    },

    updateHouseProperty(HousePropertyId, housingSituation, otherProperty) {
      return axios
        .post("/graphql/", {
          query: `mutation updateHouse_property(
                  $id: ID!
                  $housingSituation: String
                  $otherProperty: String
                ) {
                  updateHouse_property(
                    id: $id
                    housingSituation: $housingSituation
                    otherProperty: $otherProperty
                  ) {
                    id
                  }
                }`,
          variables: {
            id: HousePropertyId,
            housingSituation: housingSituation,
            otherProperty: otherProperty,
          },
        })
        .then((res) => res.data.data.updateHouse_property)
        .catch((err) => console.warn(err));
    },

    // ??? does the coordinator update photos or create new once or is that the job of social worker
    // Social Worker will be changed by select of all the Social Workers in the village
    updateOrphan(
      orphanId,
      firstName,
      gender,
      placeOfBirth,
      dateOfBirth,
      spokenLanguages,
      gradeAgeMismatchReason,
      hobbies,
      religion,
      healthDescription,
      psychologicalStatus,
      accountNumber,
      educationId,
      fatherId,
      motherId,
      guardianId,
      house_propertyId,
      socialWorkerId,
      photosIds,
      orphanUrls
    ) {
      let queryParameterInjection = "",
        query$ParameterInjection = "";
      for (const url in orphanUrls) {
        if (url !== "") {
          query$ParameterInjection += ` $${url}: String`;
          queryParameterInjection += ` ${url}: $${url}`;
        }
      }

      let query = `mutation updateOrphan(
        $id: ID!
        $firstName: String
        $gender: orphanGender
        $placeOfBirth: String
        $dateOfBirth: DateTime
        $spokenLanguages: String
        $gradeAgeMismatchReason: String
        $hobbies: String
        $religion: orphanReligion
        $healthDescription: String
        $psychologicalStatus: orphanPsychologicalStatus
        $accountNumber: String
        $educationId: ID
        $fatherId: ID
        $guardianId: ID
        $house_propertyId: ID
        $motherId: ID
        $socialWorkerId: ID
        $photos: [ID]
        ${query$ParameterInjection}
      ) {
        updateOrphan(
          id: $id
          firstName: $firstName
          gender: $gender
          placeOfBirth: $placeOfBirth
          dateOfBirth: $dateOfBirth
          spokenLanguages: $spokenLanguages
          gradeAgeMismatchReason: $gradeAgeMismatchReason
          hobbies: $hobbies
          religion: $religion
          healthDescription: $healthDescription
          psychologicalStatus: $psychologicalStatus
          accountNumber: $accountNumber
          educationId: $educationId
          fatherId: $fatherId
          guardianId: $guardianId
          house_propertyId: $house_propertyId
          motherId: $motherId
          socialWorkerId: $socialWorkerId
          photos: $photos
          ${queryParameterInjection}
        ) {
          id
          firstName
          gender
          placeOfBirth
          dateOfBirth
          spokenLanguages
          gradeAgeMismatchReason
          hobbies
          religion
          idCardUrl
          passportUrl
          originalThankyouLetterUrl
          translatedThankyouLetterUrl
          birthCertificateUrl
          healthDescription
          psychologicalStatus
          accountNumber
          currentBalance
          education {
            id
            enrollmentStatus
            schoolName
            typeOfSchool
            year
            level
            reason
            educationalRecords {
              id
            }
          }
          father {
            id
            firstName
            lastName
            dateOfDeath
            causeOfDeath
            dateOfBirth
            causeOfDeath
            deathCertificateUrl
          }
          guardian {
            id
            firstName
            middleName
            lastName
            gender
            dateOfBirth
            relationToOrphan
            email
            mobileNumber
            telephoneNumber
            nationality
            iDCardUrl
            confirmationLetterUrl
            legalConfirmationLetterUrl
          }
          house_property {
            id
            housingSituation
            otherProperty
          }
          mother {
            id
            firstName
            middleName
            lastName
            vitalStatus
            dateOfBirth
            dateOfDeath
            causeOfDeath
            mobileNumber
            maritalStatus
          }
          socialWorker {
            id
            firstName
            middleName
            lastName
            gender
            dateOfBirth
            mobileNumber
          }
          photos {
            id
            photoLongUrl
            photoPortraitUrl
          }
        }
      }`;

      let variables = {
        id: orphanId,
        firstName: firstName,
        gender: gender,
        placeOfBirth: placeOfBirth,
        dateOfBirth: dateOfBirth,
        spokenLanguages: spokenLanguages,
        gradeAgeMismatchReason: gradeAgeMismatchReason || null,
        hobbies: hobbies,
        religion: religion,
        healthDescription: healthDescription,
        psychologicalStatus: psychologicalStatus,
        accountNumber: accountNumber || null,
        educationId: educationId,
        fatherId: fatherId,
        guardianId: guardianId,
        house_propertyId: house_propertyId,
        motherId: motherId,
        socialWorkerId: socialWorkerId,
        photos: photosIds,
      };
      variables = Object.assign(variables, orphanUrls);

      return axios
        .post("/graphql/", {
          query: query,
          variables: variables,
        })
        .then((res) => res.data.data.updateOrphan)
        .catch((err) => console.warn(err));
    },

    orphanIdGenerator() {
      let orphanId = "";
      let splitName = this.orphan.village.name.trim().split(" ");
      if (splitName.length === 1) {
        orphanId =
          splitName[0].slice(0, 1).toUpperCase() +
          splitName[0].slice(splitName[0].length - 1).toUpperCase();
      } else {
        for (const namePart of splitName) {
          orphanId += namePart.slice(0, 1).toUpperCase();
        }
      }
      orphanId += "-" + this.orphan.id;
      return orphanId;
    },
    dateGenerator(date) {
      return date ? new Date(Date.parse(date.toString())).toDateString() : "";
    },
    genderGenerator(genderAbbr) {
      return genderAbbr === "M" ? "Male" : genderAbbr === "F" ? "Female" : "";
    },
    ageGenerator(date) {
      return date
        ? new Date().getFullYear() -
            new Date(Date.parse(date.toString())).getFullYear()
        : "";
    },
    portraitImageGenerator(photo) {
      // const image = this.orphan.photos.filter(val => val.id === id)[0];
      // const image = this.orphan.photos[idx];

      return photo
        ? `${axios.defaults.baseURL}${photo.photoPortraitUrl.slice(
            photo.photoPortraitUrl.indexOf("/")
          )}`
        : "";
    },
    longImageGenerator(photo) {
      // const image = this.orphan.photos.filter(val => val.id === id)[0];
      // const image = this.orphan.photos[idx];

      return photo
        ? `${axios.defaults.baseURL}${photo.photoLongUrl.slice(
            photo.photoLongUrl.indexOf("/")
          )}`
        : "";
    },
    toggleOrphanPassportDialog() {
      this.orphanPassportDialog = !this.orphanPassportDialog;
    },
    toggleOrphanBirthCertificateDialog() {
      this.orphanBirthCertificateDialog = !this.orphanBirthCertificateDialog;
    },
    toggleOriginalThankyouLetterDialog() {
      this.originalThankyouLetterDialog = !this.originalThankyouLetterDialog;
    },
    toggleOrphanIdCardDialog() {
      this.orphanIdCardDialog = !this.orphanIdCardDialog;
    },
    toggleFatherDeathCertificateDialog() {
      this.fatherDeathCertificateDialog = !this.fatherDeathCertificateDialog;
    },
    toggleConfirmationLetterDialog() {
      this.confirmationLetterDialog = !this.confirmationLetterDialog;
    },
    toggleLegalConfirmationLetterDialog() {
      this.legalConfirmationLetterDialog = !this.legalConfirmationLetterDialog;
    },
    toggleGuardianIdCardDialog() {
      this.guardianIdCardDialog = !this.guardianIdCardDialog;
    },
    toggleOrphanPassportInput() {
      if (this.orphanPassportFile) {
        this.orphanPassport = URL.createObjectURL(this.orphanPassportFile);
      }
    },
    toggleOrphanBirthCertificateInput() {
      if (this.orphanBirthCertificateFile) {
        this.orphanBirthCertificate = URL.createObjectURL(
          this.orphanBirthCertificateFile
        );
      }
    },
    toggleOriginalThankyouLetterInput() {
      if (this.originalThankyouLetterFile) {
        this.originalThankyouLetter = URL.createObjectURL(
          this.originalThankyouLetterFile
        );
      }
    },
    toggleOrphanIdCardInput() {
      if (this.orphanIdCardFile) {
        this.orphanIdCard = URL.createObjectURL(this.orphanIdCardFile);
      }
    },
    toggleFatherDeathCertificateInput() {
      if (this.fatherDeathCertificateFile) {
        this.fatherDeathCertificate = URL.createObjectURL(
          this.fatherDeathCertificateFile
        );
      }
    },
    toggleConfirmationLetterInput() {
      if (this.confirmationLetterFile) {
        this.confirmationLetter = URL.createObjectURL(
          this.confirmationLetterFile
        );
      }
    },
    toggleLegalConfirmationLetterInput() {
      if (this.legalConfirmationLetterFile) {
        this.legalConfirmationLetter = URL.createObjectURL(
          this.legalConfirmationLetterFile
        );
      }
    },
    toggleGuardianIdCardInput() {
      if (this.guardianIdCardFile) {
        this.guardianIdCard = URL.createObjectURL(this.guardianIdCardFile);
      }
    },
    editableFormatter() {
      this.orphanSelectOptions.genderOptions = this.orphanSelectOptions.genderOptions.map(
        (val) => {
          let obj = {
            text: "",
            value: "",
          };
          obj.text = val === "M" ? "Male" : "Female";
          obj.value = val;
          return obj;
        }
      );

      // removing primary_elementary and adding Primary/Elementary
      this.orphanSelectOptions.orphanEducationLevelOptions.splice(
        this.orphanSelectOptions.orphanEducationLevelOptions.indexOf(
          "primary_elementary"
        ),
        1,
        "Primary/Elementary"
      );

      this.orphanSelectOptions.orphanEducationLevelOptions = this.orphanSelectOptions.orphanEducationLevelOptions.map(
        (val) => {
          let obj = {
            text: "",
            value: "",
          };
          const regex = /[A-Z]/g;
          let idx = val.search(regex);
          if (val === "N_A") obj.text = val;
          else if (val === "Primary/Elementary") obj.text = val;
          else if (val === "preSchool")
            obj.text =
              val.slice(0, 1).toUpperCase() + val.slice(1).toLowerCase();
          else
            obj.text =
              val.slice(0, 1).toUpperCase() +
              val.slice(1, idx) +
              " " +
              val.slice(idx);
          obj.value = val;
          return obj;
        }
      );
      this.educationLevelFormatter();

      this.orphanSelectOptions.orphanEducationTypeOfSchoolOptions = this.orphanSelectOptions.orphanEducationTypeOfSchoolOptions.map(
        (val) => {
          let obj = {
            text: "",
            value: "",
          };
          if (val === "N_A") obj.text = val;
          obj.text = val.slice(0, 1).toUpperCase() + val.slice(1);
          obj.value = val;

          return obj;
        }
      );
    },
    // formats education level
    educationLevelFormatter() {
      if (this.orphan.education?.level === "religiousEducation") {
        this.orphanSelectEditableFields.orphanEducationLevel =
          "Religious Education";
        this.orphanSelectedOption.orphanEducationLevel = "Religious Education";
      } else if (this.orphan.education?.level === "preSchool") {
        this.orphanSelectEditableFields.orphanEducationLevel = "Preschool";
        this.orphanSelectedOption.orphanEducationLevel = "Preschool";
      } else if (this.orphan.education?.level === "primary_elementary") {
        this.orphanSelectEditableFields.orphanEducationLevel =
          "Primary/Elementary";
        this.orphanSelectedOption.orphanEducationLevel = "Primary/Elementary";
      } else if (this.orphan.education?.level === "junior") {
        this.orphanSelectEditableFields.orphanEducationLevel = "Junior";
        this.orphanSelectedOption.orphanEducationLevel = "Junior";
      } else if (this.orphan.education?.level === "highschool") {
        this.orphanSelectEditableFields.orphanEducationLevel = "Highschool";
        this.orphanSelectedOption.orphanEducationLevel = "Highschool";
      } else if (this.orphan.education?.level === "underGraduate") {
        this.orphanSelectEditableFields.orphanEducationLevel = "Under Graduate";
        this.orphanSelectedOption.orphanEducationLevel = "Under Graduate";
      } else if (this.orphan.education?.level === "postGraduate") {
        this.orphanSelectEditableFields.orphanEducationLevel = "Post Graduate";
        this.orphanSelectedOption.orphanEducationLevel = "Post Graduate";
      } else {
        this.orphanSelectEditableFields.orphanEducationLevel = this.orphan.education?.level;
        this.orphanSelectedOption.orphanEducationLevel = this.orphan.education?.level;
      }
    },
    copyToOrphan(baseObject, editorObject) {
      for (let editorName in editorObject) {
        const capitalCheckerRegex = /[A-Z]/;
        let idx = editorName.search(capitalCheckerRegex);
        let property = "";

        property = editorName
          .slice(idx, idx + 1)
          .toLowerCase()
          .concat(editorName.slice(idx + 1));

        if (property === null || property === "") {
          console.log(`Orphan doesn't have "${property}" property`);
        } else if (Object.hasOwnProperty.call(baseObject, property)) {
          baseObject[property] = editorObject[editorName];
        } else {
          idx = property.search(capitalCheckerRegex);
          let parentProperty = property.slice(0, idx);
          let childProperty = property
            .slice(idx, idx + 1)
            .toLowerCase()
            .concat(property.slice(idx + 1));
          if (Object.hasOwnProperty.call(baseObject, parentProperty)) {
            const childObject = baseObject[parentProperty];
            if (Object.hasOwnProperty.call(childObject, childProperty)) {
              childObject[childProperty] = editorObject[editorName];
            } else
              console.error(
                `orphan.${parentProperty}.${childProperty} doesn't exist`
              );
          } else console.error(`orphan.${parentProperty} doesn't exist`);
        }
      }
    },
    copyFromOrphan(baseObject, editorObject) {
      for (let editorName in editorObject) {
        const capitalCheckerRegex = /[A-Z]/;
        let idx = editorName.search(capitalCheckerRegex);
        let property = "";

        property = editorName
          .slice(idx, idx + 1)
          .toLowerCase()
          .concat(editorName.slice(idx + 1));

        if (property === null || property === "") {
          console.log(`Orphan doesn't have "${property}" property`);
        } else if (Object.hasOwnProperty.call(baseObject, property)) {
          editorObject[editorName] = baseObject[property];
        } else {
          idx = property.search(capitalCheckerRegex);
          let parentProperty = property.slice(0, idx);
          let childProperty = property
            .slice(idx, idx + 1)
            .toLowerCase()
            .concat(property.slice(idx + 1));
          if (Object.hasOwnProperty.call(baseObject, parentProperty)) {
            const childObject = baseObject[parentProperty];
            if (Object.hasOwnProperty.call(childObject, childProperty)) {
              editorObject[editorName] = childObject[childProperty];
            } else
              console.error(
                `orphan.${parentProperty}.${childProperty} doesn't exist`
              );
          } else console.error(`orphan.${parentProperty} doesn't exist`);
        }
      }
    },
    orphanDateOfBirthSave(date) {
      this.$refs.menu.save(date);
    },
    fatherDateOfBirthSave(date) {
      this.$refs.fatherDateOfBirthMenu.save(date);
    },
    fatherDateOfDeathSave(date) {
      this.$refs.fatherDateOfDeathMenu.save(date);
    },
    motherDateOfBirthSave(date) {
      this.$refs.motherDateOfBirthMenu.save(date);
    },
    motherDateOfDeathSave(date) {
      this.$refs.motherDateOfDeathMenu.save(date);
    },
    guardianDateOfBirthSave(date) {
      this.$refs.guardianDateOfBirthMenu.save(date);
    },

    isoDateFormatter(dateString) {
      return new Date(dateString).toISOString();
    },

    dashDateFormatter(dateString) {
      let dateFormat = new Date(dateString);
      return `${dateFormat.getFullYear()}-0${dateFormat.getMonth() +
        1}-${dateFormat.getDate()}`;
    },
  },
};
</script>
