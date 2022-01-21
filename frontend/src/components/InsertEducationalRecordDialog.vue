<template>
  <v-dialog
    v-model="isOpen"
    persistent
    :retain-focus="false"
    max-width="1024"
    overlay-color="#000"
    overlay-opacity=".3"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on">New Record</v-btn>
    </template>
    <v-card>
      <v-card-title>New Educational Record</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="educationalRecordForm" v-model="validForm" lazy-validation>
          <v-container>
            <v-row>
              <v-col align="center">
                <v-select
                  label="Enrollment Status"
                  :items="enrollmentStatusOptions"
                  v-model="enrollmentStatus"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  label="School Name"
                  v-model="schoolName"
                  :rules="[rules.required]"
                /> </v-col
              ><v-col>
                <v-select
                  label="Type Of School"
                  :items="schoolTypeOptions"
                  v-model="schoolType"
                  :rules="[rules.required]"
                /> </v-col
              ><v-col>
                <v-select
                  label="Level"
                  :items="levelOptions"
                  v-model="level"
                  :rules="[rules.required]"
                /> </v-col
              ><v-col>
                <v-select
                  no-data-text="Choose a Level"
                  label="Year"
                  :items="yearOptions"
                  v-model="year"
                  :rules="[rules.required]"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-select
                  label="Year Division"
                  :items="yearDivisionOptions"
                  v-model="yearDivision"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
              <v-col>
                <v-select
                  no-data-text="Choose a Year Divion"
                  :label="currentDivisionLabel"
                  :items="currentDivisionOptions"
                  v-model="currentDivision"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
            </v-row>
            <v-container v-if="enrollmentStatus === 'droppedout'" px-0>
              <v-row>
                <v-col>
                  <v-text-field
                    label="Reason"
                    v-model="reason"
                    :rules="[rules.required]"
                  /> </v-col
              ></v-row>
            </v-container>
            <v-container v-if="enrollmentStatus === 'enrolled'" px-0>
              <v-row
                v-if="
                  level === 'primary_elementary' ||
                    level === 'junior' ||
                    level === 'highschool'
                "
              >
                <v-col>
                  <v-text-field
                    label="Total Mark"
                    v-model="totalMark"
                    :rules="[rules.required, rules.numberAboveZero]"
                  ></v-text-field>
                </v-col>
                <v-col
                  ><v-text-field
                    label="Number Of Subjects"
                    v-model="numberOfSubjects"
                    :rules="[rules.required, rules.numberAboveZero]"
                  ></v-text-field
                ></v-col>
                <v-col
                  ><v-text-field
                    label="Average"
                    v-model="average"
                    :rules="[rules.required, rules.numberAboveZero]"
                  ></v-text-field
                ></v-col>
                <v-col
                  ><v-text-field
                    label="Rank"
                    v-model="rank"
                    :rules="[rules.required, rules.numberAboveZero]"
                  ></v-text-field
                ></v-col>
              </v-row>
              <v-row
                v-else-if="
                  level === 'underGraduate' || level === 'postGraduate'
                "
              >
                <v-col
                  ><v-text-field
                    label="Semester GPA"
                    v-model="semesterGPA"
                    :rules="[rules.required, rules.GPA]"
                  ></v-text-field></v-col
                ><v-col
                  ><v-text-field
                    label="Cumulative GPA"
                    v-model="cumulativeGPA"
                    :rules="[rules.required, rules.GPA]"
                  ></v-text-field
                ></v-col>
              </v-row>
              <v-col
                ><v-file-input
                  v-model="reportCard"
                  label="Report card / Grade report"
                  accept="image/*"
                  prepend-icon="mdi-attachment"
                  :rules="[rules.required]"
                  ><template v-slot:append>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          class="ml-auto"
                          v-bind="attrs"
                          v-on="on"
                          @click="openReportCardPreviewDialog"
                        >
                          mdi-file-eye
                        </v-icon>
                      </template>
                      <span>Preview</span>
                    </v-tooltip>
                    <v-dialog
                      v-model="reportCardPreviewDialog"
                      max-height="600"
                      max-width="400"
                      overlay-color="#eee"
                      overlay-opacity=".3"
                    >
                      <v-img :src="reportCardPreview" contain></v-img>
                    </v-dialog>
                  </template> </v-file-input
              ></v-col>
            </v-container>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeInsertEducationalRecordDialog" color="#eee"
          >Cancel</v-btn
        >
        <v-btn @click="saveInsertEducatioanlRedordDialog" color="primary"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
export default {
  props: ["orphanId"],
  data() {
    return {
      isOpen: false,
      rules: {
        required: value => !!value || "Required.",
        name: value => {
          const namePattern = /(^[A-z][A-Z-a-z/'.,/]+)[A-z]\s*$/g;
          return namePattern.test(value) || "Invalid name";
        },
        numberAboveZero: value => {
          return (
            (typeof parseFloat(value) === "number" && value > 0) ||
            "Value must be a number above 0."
          );
        },
        GPA: value => {
          return (
            (typeof parseFloat(value) === "number" &&
              value >= 0.0 &&
              value <= 4.0) ||
            "Value must be a number between 0 and 4."
          );
        }
      },
      enrollmentStatus: null,
      enrollmentStatusOptions: [
        {
          text: "Enrolled",
          value: "enrolled"
        },
        {
          text: "Drop-Out",
          value: "droppedout"
        }
        // removed because u can't be unenrolled after enrollment, u can only dropout
        // { text: "Un-Enrolled", value: "unenrolled" }
      ],
      schoolName: null,
      level: null,
      levelOptions: [
        { text: "Pre-school", value: "preSchool" },
        { text: "Religious Education", value: "religiousEducation" },
        { text: "Primary/Elementary", value: "primary_elementary" },
        { text: "Junior", value: "junior" },
        { text: "Highschool", value: "highschool" },
        { text: "Undergraduate", value: "underGraduate" },
        { text: "Postgraduate", value: "postGraduate" }
      ],
      schoolType: null,
      schoolTypeOptions: [
        { text: "Public", value: "public" },
        { text: "Private", value: "private" }
      ],
      year: null,
      yearOptions: [],
      reason: null,
      yearDivision: null,
      yearDivisionOptions: [
        {
          text: "Quarter / Term",
          value: "quarter_term"
        },
        {
          text: "Semester",
          value: "semester"
        }
      ],
      currentDivisionLabel: "Current ...",
      currentDivision: null,
      currentDivisionOptions: [],
      totalMark: null,
      numberOfSubjects: null,
      average: null,
      rank: null,
      semesterGPA: null,
      cumulativeGPA: null,
      reportCard: null,
      reportCardPreviewDialog: null,
      reportCardPreview: null,
      validForm: null
    };
  },
  watch: {
    level() {
      if (this.level === "religiousEducation") {
        this.yearOptions = [1, 2, 3];
      } else if (this.level === "preSchool") {
        this.yearOptions = ["Preparatory", "Nursery", "LKG", "UKG"];
      } else if (this.level === "primary_elementary") {
        this.yearOptions = [1, 2, 3, 4, 5, 6];
      } else if (this.level === "junior") {
        this.yearOptions = [7, 8];
      } else if (this.level === "highschool") {
        this.yearOptions = [9, 10, 11, 12];
      } else if (
        this.level === "underGraduate" ||
        this.level === "postGraduate"
      ) {
        this.yearOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      }
    },
    yearDivision() {
      if (this.yearDivision === "semester") {
        this.currentDivisionLabel = "Current Semester";
        this.currentDivisionOptions = [
          {
            text: "First",
            value: "first"
          },
          {
            text: "Second",
            value: "second"
          }
        ];
      } else if (this.yearDivision === "quarter_term") {
        this.currentDivisionLabel = "Current Quarter / Term";
        this.currentDivisionOptions = [
          {
            text: "First",
            value: "first"
          },
          {
            text: "Second",
            value: "second"
          },
          {
            text: "Third",
            value: "third"
          },
          {
            text: "Fourth",
            value: "fourth"
          }
        ];
      }
    }
  },
  methods: {
    ...mapMutations([
      "SET_SNACKBAR",
      "SET_SNACKBAR_COLOR",
      "SET_SNACKBAR_TEXT"
    ]),
    closeInsertEducationalRecordDialog() {
      this.isOpen = false;
    },
    saveInsertEducatioanlRedordDialog() {
      if (this.$refs.educationalRecordForm.validate()) {
        const reportCardFormData = new FormData();
        if (this.reportCard) {
          reportCardFormData.append(
            "educationalRecordReportCard",
            this.reportCard,
            this.reportCard.name
          );
        }
        (async () => {
          try {
            const reportCardRes = await axios.post(
              "/public/images/educationalRecordReportCard",
              reportCardFormData
            );

            (async () => {
              try {
                const query = `
                  mutation createEducationalRecord(
                    $enrollmentStatus: educationEnrollmentStatus!
                    $schoolName: String
                    $typeOfSchool: educationTypeOfSchool
                    $year: String
                    $level: educationLevel
                    $reason: String
                    $yearDivision: ERYearDivision
                    $quarter: ERQuarter
                    $semester: ERSemester
                    $totalMark: Float
                    $numberOfSubjects: Int
                    $average: Float
                    $rank: Int
                    $reportCardUrl: String
                    $semesterGPA: Float
                    $cumulativeGPA: Float
                    $orphanId: ID!
                  ) {
                      createEducationalRecord(
                        enrollmentStatus: $enrollmentStatus
                        schoolName: $schoolName
                        typeOfSchool: $typeOfSchool
                        year: $year
                        level: $level
                        reason: $reason
                        yearDivision: $yearDivision
                        quarter: $quarter
                        semester: $semester
                        totalMark: $totalMark
                        numberOfSubjects: $numberOfSubjects
                        average: $average
                        rank: $rank
                        reportCardUrl: $reportCardUrl
                        semesterGPA: $semesterGPA
                        cumulativeGPA: $cumulativeGPA
                        orphanId: $orphanId
                      ) {
                          id
                          created_at
                        }
                    }`;

                const queryOptions = {
                  query,
                  variables: {
                    enrollmentStatus: this.enrollmentStatus,
                    schoolName: this.schoolName,
                    typeOfSchool: this.schoolType,
                    year: `${this.year}`,
                    level: this.level,
                    reason: this.reason,
                    yearDivision: this.yearDivision,
                    quarter: this.currentDivision,
                    semester: this.currentDivision,
                    totalMark: parseFloat(this.totalMark),
                    numberOfSubjects: parseInt(this.numberOfSubjects),
                    average: parseFloat(this.average),
                    rank: parseInt(this.rank),
                    reportCardUrl: reportCardRes.data,
                    semesterGPA: parseFloat(this.semesterGPA),
                    cumulativeGPA: parseFloat(this.cumulativeGPA),
                    orphanId: parseInt(this.orphanId)
                  }
                };
                const insertEducationalRecordResponse = await axios.post(
                  `/graphql/`,
                  queryOptions
                );
                if (insertEducationalRecordResponse.data.errors?.length) {
                  throw new Error(
                    insertEducationalRecordResponse.data.errors[0].message.message
                  );
                }
                this.SET_SNACKBAR(true);
                this.SET_SNACKBAR_COLOR("success");
                this.SET_SNACKBAR_TEXT("Record added successfully");
                this.isOpen = false;
                this.$refs.educationalRecordForm.reset();
                this.$emit("addedSuccessfully");
              } catch (error) {
                this.SET_SNACKBAR(true);
                this.SET_SNACKBAR_COLOR("error");
                this.SET_SNACKBAR_TEXT(
                  "Server error. Reload the page and try again."
                );
                console.error(error);
              }
            })();
          } catch (error) {
            this.SET_SNACKBAR(true);
            this.SET_SNACKBAR_COLOR("error");
            this.SET_SNACKBAR_TEXT(
              "Server error. Reload the page and try again."
            );
            console.error(error);
          }
        })();
      }
    },
    openReportCardPreviewDialog() {
      if (this.$refs.educationalRecordForm.inputs[7].validate()) {
        this.reportCardPreview = URL.createObjectURL(this.reportCard);
        this.reportCardPreviewDialog = true;
      }
    }
  }
};
</script>

<style></style>
