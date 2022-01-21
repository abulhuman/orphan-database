<template>
  <v-dialog
    v-model="isOpen"
    persistent
    :retain-focus="false"
    max-width="1024"
    overlay-color="#000"
    overlay-opacity=".3"
  >
    <template v-slot:activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on:tooltip }">
          <v-icon
            v-if="!isOrphanDetail"
            class="mr-2"
            color="teal darken-2"
            v-bind="attrs"
            v-on="{ ...tooltip, ...dialog }"
            @click="populateEducationalRecordsTable(item)"
          >
            mdi-file-plus
          </v-icon>
          <v-btn
            v-else
            color="teal lighten-4"
            v-bind="attrs"
            v-on="{ ...tooltip, ...dialog }"
            @click="populateEducationalRecordsTable(item)"
          >
            Educational Records
          </v-btn>
        </template>

        <span>Educational Records</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title
        ><span>Educational Records</span> <v-spacer></v-spacer>
        <insert-educational-record-dialog
          :orphanId="orphanId"
          @addedSuccessfully="populateEducationalRecordsTable(item)"
        />
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <!-- Table -->
          <v-col cols="12">
            <v-data-table
              :items="educationalRecordsTableItems"
              :headers="educationalRecordsTableHeaders"
              :items-per-page="itemsPerPage"
              show-expand
              single-expand
              :expanded.sync="educationalRecordsTableExpandedRecords"
            >
              <template v-slot:[`expanded-item`]="{ headers, item }" right>
                <td :colspan="headers.length" class="px-0">
                  <v-card class="elevation-1" tile>
                    <v-card-title>Record Details</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text cols="12">
                      <v-row>
                        <v-col
                          ><p>School Name: {{ item.schoolName }}</p></v-col
                        >
                        <v-col
                          ><p>
                            Status:
                            {{ item.status.substring(0, 1).toUpperCase()
                            }}{{ item.status.substring(1).toLowerCase() }}
                          </p></v-col
                        >
                        <v-col
                          ><p>
                            School Type:
                            {{ item.typeOfSchool.substring(0, 1).toUpperCase()
                            }}{{ item.typeOfSchool.substring(1).toLowerCase() }}
                          </p></v-col
                        >
                      </v-row>
                      <v-row>
                        <v-col
                          ><p>Education Level: {{ item.level }}</p></v-col
                        ><v-col
                          ><p>
                            Year Division:
                            {{
                              item.yearDivision.substring(0, 1).toUpperCase() ==
                              `S`
                                ? `${item.yearDivision
                                    .substring(0, 1)
                                    .toUpperCase()}${item.yearDivision
                                    .substring(1)
                                    .toLowerCase()}`
                                : `Quarter`
                            }}
                          </p></v-col
                        ><v-col
                          ><p>
                            Current
                            {{
                              item.yearDivision.substring(0, 1).toUpperCase() ==
                              "S"
                                ? `Semester`
                                : `Quarter`
                            }}:
                            {{
                              item.yearDivision.substring(0, 1).toUpperCase() ==
                              "S"
                                ? `${item.semester
                                    .substring(0, 1)
                                    .toUpperCase()}${item.semester
                                    .substring(1)
                                    .toLowerCase()}`
                                : `${item.quarter
                                    .substring(0, 1)
                                    .toUpperCase()}${item.quarter
                                    .substring(1)
                                    .toLowerCase()}`
                            }}
                          </p></v-col
                        >
                      </v-row>
                      <v-row v-if="item.semesterGPA">
                        <v-col
                          ><p>Semester GPA: {{ item.semesterGPA }}</p></v-col
                        >
                        <v-col
                          ><p>
                            Cumulative GPA: {{ item.cumulativeGPA }}
                          </p></v-col
                        >
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <template>
                            <custom-image
                              :url="item.reportCardUrl"
                              type="EDR"
                              v-if="!badUrl"
                              @badUrl="badUrl = true"
                            ></custom-image>
                            <p v-else>
                              Report Card Image Not Found
                            </p>
                          </template>
                        </v-col>
                      </v-row>
                    </v-card-text></v-card
                  >
                </td>
              </template>
            </v-data-table></v-col
          >
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          elevation="2"
          class="mr-3 my-3"
          color="#eee"
          @click="closeEducationalRecordsDialog"
          >close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import moment from "moment";
import InsertEducationalRecordDialog from "./InsertEducationalRecordDialog.vue";
import CustomImage from "./CustomImage.vue";
import { mapMutations } from "vuex";
export default {
  components: { InsertEducationalRecordDialog, CustomImage },
  props: ["open", "item", "isEditable", "isOrphanDetail"],
  data() {
    return {
      isOpen: false,
      // Educational Record Upload Form Dialog
      educationalRecordsDialog: false,
      educationalRecordsTableItems: [],
      itemsPerPage: 5,
      orphanId: null,
      educationalRecordsTableHeaders: [
        {
          text: "Date",
          value: "created_at"
        },
        // {
        //   text: "Status",
        //   value: "status"
        // },
        // {
        //   text: "School Name",
        //   value: "schoolName"
        // },
        // {
        //   text: "Type",
        //   value: "typeOfSchool"
        // },
        {
          text: "Grade / Year",
          value: "year"
        },
        // {
        //   text: "Education Level",
        //   value: "eddLvl "
        // },
        // {
        //   text: "Division",
        //   value: "yearDivision"
        // },
        // {
        //   text: "Quarter",
        //   value: "quarter"
        // },
        // {
        //   text: "Semester",
        //   value: "semester"
        // },
        {
          text: "Total",
          value: "totalMark"
        },
        {
          text: "# Subjects",
          value: "numberOfSubjects"
        },
        {
          text: "Average",
          value: "average"
        },
        {
          text: "Rank",
          value: "rank"
        }
        // {
        //   text: "SGPA",
        //   value: "semesterGPA"
        // },
        // {
        //   text: "CGPA",
        //   value: "cumulativeGPA"
        // }
      ],
      educationalRecordsTableExpandedRecords: [],
      badUrl: false
    };
  },
  computed: {},
  methods: {
    ...mapMutations([
      "SET_SNACKBAR",
      "SET_SNACKBAR_COLOR",
      "SET_SNACKBAR_TEXT"
    ]),
    populateEducationalRecordsTable(item) {
      (async () => {
        try {
          const query = `
              query educationalRecordsByOrphanId($orphanId: ID!){
                  orphan(id:$orphanId){
                    id
                    educationalRecords{
                      id
                      created_at
                      enrollmentStatus
                      schoolName
                      typeOfSchool
                      year
                      level
                      reason
                      yearDivision
                      quarter
                      semester
                      totalMark
                      numberOfSubjects
                      average
                      rank
                      reportCardUrl
                      semesterGPA
                      cumulativeGPA
                    }
                  }
                }
              `;
          const requestOptions = { query, variables: { orphanId: item.id } };
          const ERRes = await axios.post(`/graphql/`, requestOptions);
          if (ERRes.data.errors?.length) {
            throw new Error(ERRes.data.errors[0].message.message);
          }
          this.orphanId = ERRes.data.data.orphan.id;
          let tempRecords = ERRes.data.data.orphan.educationalRecords.map(
            item => {
              let returnItem = { ...item };
              returnItem.status = item.enrollmentStatus;
              returnItem.level =
                item.level == "religiousEducation"
                  ? "Religious Education"
                  : item.level == "preSchool"
                  ? "Kindergarten (pre-school & KG)"
                  : item.level == "primary_elementary"
                  ? "Primary / Elementary School"
                  : item.level == "junior"
                  ? "Junior School"
                  : item.level == "highschool"
                  ? "High School"
                  : item.level == "underGraduate"
                  ? "Undergraduate (University / College)"
                  : item.level == "postGraduate"
                  ? "Postgraduate (University / College)"
                  : "Not Assigned";
              delete returnItem.enrollmentStatus;
              return returnItem;
            }
          );

          tempRecords.sort((a, b) =>
            moment(b.created_at).diff(a.created_at, `minutes`)
          );
          tempRecords.forEach(element => {
            element.created_at = moment(item.created_at).format("DD/MM/YY");
          });

          this.educationalRecordsTableItems = tempRecords;
        } catch (error) {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR("error");
          this.SET_SNACKBAR_TEXT(
            "Server error. Reload the page and try again."
          );
          console.error(error);
        }
      })();
    },
    closeEducationalRecordsDialog() {
      this.isOpen = false;
    }
  }
};
</script>

<style></style>
