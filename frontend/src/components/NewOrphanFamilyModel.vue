<template>
  <v-form ref="familyForm" v-model="validFamilyForm" lazy-validation>
    <v-container>
      <v-row>
        <!-- Father Section -->
        <template>
          <v-col sm="12" class="mb-n2">
            <div class="title mt-3 mb-n5">Father</div>
          </v-col>
          <!-- Father Date of Birth field -->
          <v-col cols="12" sm="6" md="3">
            <v-responsive max-width="" class="">
              <v-menu
                ref="fatherDateOfBirthMenu"
                v-model="fatherDateOfBirthMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="fatherDateOfBirth"
                    label="Date of Birth*"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="[rules.required]"
                  ></v-text-field>
                </template>
                <!-- v-model="orphan.father.dateOfBirth" -->
                <v-date-picker
                  ref="fatherDateOfBirthPicker"
                  v-model="fatherDateOfBirth"
                  no-title
                  scrollable
                  :max="
                    new Date(
                      new Date().setFullYear(
                        new Date().getFullYear() - this.FATHER_AGE_LIMIT
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
            </v-responsive>
          </v-col>
          <!-- Father Date of Death field -->
          <v-col cols="12" sm="6" md="3">
            <v-responsive max-width="" class="">
              <v-menu
                ref="fatherDateOfDeathMenu"
                v-model="fatherDateOfDeathMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <!-- v-model="orphan.father.dateOfDeath" -->
                  <v-text-field
                    v-model="fatherDateOfDeath"
                    label="Date of Death*"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="[rules.required]"
                  ></v-text-field>
                </template>
                <v-date-picker
                  ref="fatherDateOfDeathPicker"
                  v-model="fatherDateOfDeath"
                  no-title
                  scrollable
                  :max="new Date().toISOString().substr(0, 10)"
                  :min="
                    new Date(
                      new Date().setFullYear(
                        new Date().getFullYear() - this.FATHER_AGE_LIMIT
                      )
                    )
                      .toISOString()
                      .substr(0, 10)
                  "
                  @change="fatherDateOfDeathSave"
                >
                </v-date-picker>
              </v-menu>
            </v-responsive>
          </v-col>
          <!-- TODO # change this field to select when provided -->
          <!-- Father Cause of Death field-->
          <v-col cols="12" sm="6" md="6">
            <v-responsive max-width="" class="">
              <!-- v-model="orphan.father.causeOfDeath" -->
              <v-text-field
                v-model="fatherCauseOfDeath"
                label="Cause of Death*"
                :rules="[rules.required]"
              >
              </v-text-field>
            </v-responsive>
          </v-col>
        </template>
        <!-- Mother Section -->
        <template>
          <v-col sm="12" class="mt-n4 mb-n2">
            <div class="title mt-n3 mb-n5">Mother</div>
          </v-col>
          <!-- Mother First Name field-->
          <v-col cols="12" sm="6" md="4">
            <v-responsive max-width="" class="">
              <v-text-field
                v-model="orphan.mother.firstName"
                label="First Name*"
                :rules="[rules.required, rules.name]"
              >
              </v-text-field>
            </v-responsive>
          </v-col>
          <!-- Mather Middle Name field-->
          <v-col cols="12" sm="6" md="4">
            <v-responsive max-width="" class="">
              <v-text-field
                v-model="orphan.mother.middleName"
                :rules="[rules.required, rules.name]"
                label="Middle Name*"
              >
              </v-text-field>
            </v-responsive>
          </v-col>
          <!-- Mother Last Name field -->
          <v-col cols="12" sm="6" md="4">
            <v-responsive max-width="" class="">
              <v-text-field
                v-model="orphan.mother.lastName"
                :rules="[rules.required, rules.name]"
                label="Last Name*"
              >
              </v-text-field>
            </v-responsive>
          </v-col>
          <!-- Mother Date of Birth field -->
          <v-col cols="12" sm="6" md="4" class="mt-n6">
            <v-responsive max-width="" class="">
              <v-menu
                ref="motherDateOfBirthMenu"
                v-model="motherDateOfBirthMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="orphan.mother.dateOfBirth"
                    label="Date of Birth*"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :rules="[rules.required]"
                  ></v-text-field>
                </template>
                <v-date-picker
                  ref="motherDateOfBirthPicker"
                  v-model="orphan.mother.dateOfBirth"
                  no-title
                  scrollable
                  :max="
                    new Date(
                      new Date().setFullYear(
                        new Date().getFullYear() - this.MOTHER_AGE_LIMIT
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
            </v-responsive>
          </v-col>
          <!-- Mother Vital Status field -->
          <v-col cols="12" sm="6" md="4" class="mt-n6">
            <v-responsive max-width="" class="">
              <v-select
                v-model="selectedOrphan.motherVitalStatus"
                :items="motherVitalStatusOptions"
                :menu-props="{
                  bottom: true,
                  offsetY: true,
                }"
                :rules="[rules.required]"
                label="Vital Status*"
              ></v-select>
            </v-responsive>
          </v-col>
          <!-- Mother Martial Status field -->
          <template v-if="selectedOrphan.motherVitalStatus === 'Alive'">
            <v-col cols="12" sm="6" md="4" class="mt-n6">
              <v-responsive max-width="" class="">
                <v-select
                  v-model="selectedOrphan.motherMaritalStatus"
                  :items="motherMaritalStatusOptions"
                  :menu-props="{
                    bottom: true,
                    offsetY: true,
                  }"
                  label="Marital Status"
                ></v-select>
              </v-responsive>
            </v-col>
          </template>
          <!-- Mother Date of Death field -->
          <template
            v-else-if="selectedOrphan.motherVitalStatus === 'Passed Away'"
          >
            <v-col cols="12" sm="6" md="4" class="mt-n6">
              <v-responsive max-width="" class="">
                <v-menu
                  ref="motherDateOfDeathMenu"
                  v-model="motherDateOfDeathMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="motherDateOfDeath"
                      label="Date of Death"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    ref="motherDateOfDeathPicker"
                    v-model="motherDateOfDeath"
                    no-title
                    scrollable
                    :max="new Date().toISOString().substr(0, 10)"
                    :min="
                      new Date(
                        new Date().setFullYear(
                          new Date().getFullYear() - this.MOTHER_AGE_LIMIT
                        )
                      )
                        .toISOString()
                        .substr(0, 10)
                    "
                    @change="motherDateOfDeathSave"
                  >
                  </v-date-picker>
                </v-menu>
              </v-responsive>
            </v-col>
          </template>
        </template>
        <!-- House and Property Info -->
        <template class="mt-n4">
          <v-col sm="12">
            <div class="title mt-n3 mb-n5">Housing and Property</div>
          </v-col>
          <!-- TODO # change this field to select -->
          <!-- Housing Situation field -->
          <v-col cols="12" sm="6" md="7" class="mb-n3">
            <v-select
              v-model="orphan.House_property.housingSituation"
              :items="orphanHousingSituationOptions"
              :menu-props="{
                bottom: true,
                offsetY: true,
              }"
              :rules="[rules.required]"
              label="Housing Situation*"
            ></v-select>
            <!-- <v-responsive max-width="" class="">
                      <v-combobox
                        v-model="orphanHousingSituationSelect"
                        :items="orphanHousingSituationOptions"
                        :menu-props="{
                          bottom: true,
                          offsetY: true,
                        }"
                        label="Housing Situation"
                        multiple
                        chips
                      >
                        <template
                          v-slot:selection="{ attrs, item, select, selected }"
                        >
                          <v-chip
                            v-bind="attrs"
                            :input-value="selected"
                            close
                            @click:close="
                              removeOrphanHousingSituationSelect(
                                attrs,
                                item,
                                select,
                                selected
                              )
                            "
                          >
                            <strong>{{ item }}</strong> </v-chip
                          >,
                        </template>
                      </v-combobox>
                    </v-responsive> -->
          </v-col>
          <!-- Other Properties -->
          <v-col cols="12" sm="12" md="12" class="mt-n5">
            <v-responsive max-width="" class="">
              <v-textarea
                v-model="orphan.House_property.otherProperty"
                label="Other Properties"
                auto-grow
                rows="1"
              ></v-textarea>
            </v-responsive>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  props: {
    updatedOrphan: {
      type: Object,
    },
    save: {
      type: Boolean,
    },
    cancel: {
      type: Boolean,
    },
  },
  data() {
    return {
      FATHER_AGE_LIMIT: 15,
      MOTHER_AGE_LIMIT: 13,
      // dialog
      dialog: false,
      validFamilyForm: null,
      formHasErrors: null,
      orphan: {
        father: {
          dateOfBirth: null,
          dateOfDeath: null,
          causeOfDeath: null,
        },
        mother: {
          firstName: null,
          middleName: null,
          lastName: null,
          dateOfBirth: null,
          vitalStatus: null,
          maritalStatus: null,
          dateOfDeath: null,
        },
        House_property: {
          housingSituation: null,
          otherProperty: null,
        },
      },
      selectedOrphan: {
        motherVitalStatus: null,
        motherMaritalStatus: null,
      },
      rules: {
        required: (value) => !!value || "Required.",
        name: (value) => {
          const namePattern = /(^[A-z][A-Z-a-z/'.,/]+)[A-z]\s*$/g;
          return namePattern.test(value) || "Invalid name";
        },
      },
      fatherDateOfBirthMenu: false,
      fatherDateOfDeathMenu: false,
      fatherDateOfBirth: null,
      fatherDateOfDeath: null,
      fatherCauseOfDeath: null,
      motherDateOfBirthMenu: false,
      motherDateOfDeathMenu: false,
      motherDateOfDeath: null,
      motherVitalStatusOptions: ["Alive", "Passed Away"],
      motherMaritalStatusOptions: ["Widow", "Married"],
      orphanHousingSituationOptions: [
        "Privately Owned",
        "Rental",
        "With Relative",
        "Dependent",
        "Other",
      ],
    };
  },
  created() {},
  mounted() {
    // this.test();
  },
  computed: {
    orphanFamilySave: function() {
      return this.save;
    },
    orphanFamilyCancel: function() {
      return this.cancel;
    },
  },
  watch: {
    orphanFamilySave(val) {
      if (val) this.familyDialogNext();
    },
    orphanFamilyCancel(val) {
      if (val) this.familyDialogCancel();
    },
    validFamilyForm(val) {
      this.$emit("familyError", val);
    },
    fatherDateOfBirthMenu(val) {
      // Changes the active picker from the default "DATE" to "YEAR"
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
      // Changes the active picker from the default "DATE" to "YEAR"
      val &&
        setTimeout(
          () => (this.$refs.motherDateOfBirthPicker.activePicker = "YEAR")
        );
    },

    motherDateOfDeathMenu(val) {
      // Changes the active picker from the default "DATE" to "YEAR"
      val &&
        setTimeout(
          () => (this.$refs.motherDateOfDeathPicker.activePicker = "YEAR")
        );
    },
  },
  methods: {
    // test() {console.log("updatedOrphanFamily", this.updatedOrphan)},
    // dialog
    fatherDateOfBirthSave(date) {
      // console.log(this.$refs.menu);
      this.$refs.fatherDateOfBirthMenu.save(date);
    },
    fatherDateOfDeathSave(date) {
      // console.log(this.$refs.menu);
      this.$refs.fatherDateOfDeathMenu.save(date);
    },
    motherDateOfBirthSave(date) {
      // console.log(this.$refs.menu);
      this.$refs.motherDateOfBirthMenu.save(date);
    },
    motherDateOfDeathSave(date) {
      // console.log(this.$refs.menu);
      this.$refs.motherDateOfDeathMenu.save(date);
    },
    // combobox methods
    removeOrphanHousingSituationSelect(attrs, item) {
      this.orphanHousingSituationSelect.splice(
        this.orphanHousingSituationSelect.indexOf(item),
        1
      );
      console.log(this.orphanHousingSituationSelect);
      console.log(attrs);
      this.orphanHousingSituationSelect = [
        ...this.orphanHousingSituationSelect,
      ];
    },

    familyDialogClose() {
      this.dialog = false;
    },

    familyDialogReset() {
      this.formHasErrors = false;
      this.$refs.familyForm.reset();
    },

    familyDialogNext() {
      this.formHasErrors = false;

      if (this.$refs.familyForm.validate()) {
        this.orphan = Object.assign(this.orphan ?? {}, this.updatedOrphan);

        this.orphan.father = Object.assign(
          this.orphan.father ?? {},
          this.updatedOrphan?.father
        );

        this.orphan.father.causeOfDeath = this.fatherCauseOfDeath;
        this.orphan.father.dateOfBirth = this.fatherDateOfBirth;
        this.orphan.father.dateOfDeath = this.fatherDateOfDeath;

        this.orphan.mother.vitalStatus = this.selectedOrphan.motherVitalStatus
          .split(" ")[0]
          .toString()
          .toLowerCase();
        if (this.orphan.mother.vitalStatus === "passed") {
          this.orphan.mother.dateOfDeath = this.motherDateOfDeath;
          this.orphan.mother.maritalStatus = null;
          this.orphan.mother.mobileNumber = null;
          this.orphan.mother.monthlyExpense = null;
        } else {
          this.orphan.mother.maritalStatus = this.selectedOrphan.motherMaritalStatus?.toLowerCase();
          this.orphan.mother.dateOfDeath = null;
          // This will have to be changed after discussion
          this.orphan.mother.mobileNumber = "0974671463";
          this.orphan.mother.monthlyExpense = parseFloat(987.76);
        }

        this.$emit("familyDone", this.orphan);
        this.$emit("familyRefs", this.$refs.familyForm);
        this.familyDialogClose();
      } else if (!this.$refs.familyForm.validate()) {
        this.formHasErrors = true;
      }
    },

    familyDialogCancel() {
      this.familyDialogReset();
      this.familyDialogClose();
    },
  },
};
</script>
