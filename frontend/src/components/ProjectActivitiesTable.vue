<template>
  <v-card style="margin: auto;">
    <v-card-title>
      Project Activities
      <v-spacer></v-spacer>
      <v-btn icon class="mr-3" @click="initialize"
        ><v-icon>mdi-refresh</v-icon></v-btn
      >
      <v-btn v-if="downloadButton" class="mr-3" small
        ><v-icon dense class="mr-2">mdi-download</v-icon>Download</v-btn
      >
      <v-dialog
        v-model="showReport.dialog"
        max-width="350px"
        transition="dialog-transition"
      >
        <template #activator="{on,attrs}">
          <v-btn v-on="on" v-bind="attrs" class="primary" small
            >Show Report</v-btn
          >
        </template>
        <v-card>
          <v-card-title primary-title>
            Project Activity Progress Report
          </v-card-title>
          <v-card-text>
            <v-form class="mx-3" lazy-validation ref="showReportForm">
              <v-row>
                <v-col>
                  <v-select
                    label="Report Duration"
                    v-model="showReport.reportDuration"
                    :items="showReport.reportDurationOptions"
                    :rules="[rules.required]"
                  />
                </v-col>
              </v-row>
              <v-row v-if="showReport.reportDuration == 'Yearly'">
                <v-col>
                  <v-select
                    :items="showReport.yearOptions"
                    v-model="showReport.year"
                    label="Year"
                  />
                </v-col>
              </v-row>
              <div v-else-if="showReport.reportDuration == 'Semi-annual'">
                <v-row>
                  <v-col>
                    <v-select
                      :items="showReport.yearOptions"
                      v-model="showReport.year"
                      label="Year"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-select
                      label="Half"
                      :items="['First', 'Second']"
                      v-model="showReport.half"
                    />
                  </v-col>
                </v-row>
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              @click="showReport.dialog = !showReport.dialog"
              class="secondary lighten-2"
              >Cancel</v-btn
            >
            <v-btn @click="reportParamsNext()" class="primary">Next</v-btn>
          </v-card-actions>
        </v-card> </v-dialog
      ><v-btn
        icon
        dark
        small
        class="ml-3"
        color="error"
        @click="$emit('closeProjectActivitiesTable')"
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </v-card-title>
    <v-divider></v-divider>
    <!-- <v-container> -->
    <v-data-table
      :headers="headers"
      :items="activities"
      hide-default-footer
      class="elevation-0 align-self-center"
      item-key="id"
      loading="true"
      dense
      group-by="Category"
    >
    </v-data-table>
    <!-- </v-container> -->
  </v-card>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  props: ['projectId'],
  data() {
    return {
      item: null,
      downloadButton: true,
      activities: [],
      headers: [
        {
          text: 'S/N',
          value: 'id'
        },
        {
          text: 'Activity',
          value: 'title'
        },
        {
          text: 'Unit',
          value: 'unitOfMeasurement'
        },
        {
          text: 'Annual Plan',
          value: 'planOfAYear'
        },
        {
          text: 'Semi-Annual Plan',
          value: 'planOfSixMonths'
        },
        {
          text: 'Quarterly Plan',
          value: 'planOfAQuarter'
        },
        {
          text: 'Monthly Plan',
          value: 'planOfAMonth'
        }
        // {
        //   text: 'Daily Progress',
        //   value: 'actions'
        // }
      ],
      showReport: {
        dialog: false,
        reportDuration: null,
        reportDurationOptions: [
          'Total So Far',
          'This Year So Far',
          'Yearly',
          'Semi-annual',
          'Quarterly',
          'Monthly',
          'Daily',
          'Other'
        ],
        year: null,
        yearOptions: [],
        half: null,
        halfOptions: []
      },
      rules: {
        required: (v) => !!v || 'Required',
        isNumeric: (v) => /[0-9]/.test(v) || 'Must numeric'
      }
    }
  },
  computed: {
    // 'showreport.reportDuration': function() {
    //   return null
    // }
  },
  watch: {
    'showReport.reportDuration': function() {
      if (
        ['Yearly', 'Semi-annual', 'Quarterly', 'Daily'].includes(
          this.showReport.reportDuration
        )
      ) {
        const projectStartDate = parseInt(
          moment(this.activities[0].project.startDate).format('YYYY')
        )
        const projectEndDate = parseInt(
          moment(this.activities[0].project.endDate).format('YYYY')
        )
        for (
          let index = projectStartDate;
          index < projectEndDate + 1;
          index++
        ) {
          this.showReport.yearOptions.push(index)
        }
      }
    }
  },
  created() {
    this.initialize()
  },
  methods: {
    async initialize() {
      const query = `query GPABPI($projectId: ID!) {
                        items: getProjectActivitiesByProjectId(projectId: $projectId) {
                            id
                            title
                            unitOfMeasurement
                            Category: category
                            planOfAYear
                            planOfSixMonths
                            planOfAQuarter
                            planOfAMonth
                            dailyActivities {
                                id
                                planOfADay
                                accomplishmentPercentage
                                accomplishmentAmount
                            }
                            project {
                                startDate
                                endDate
                                location {
                                    district {
                                    name
                                    }
                                }
                            }
                            socialWorker {
                                districts {
                                    name
                                }
                            }
                        }
                    }`
      const variables = { projectId: this.projectId }
      const res = await axios.post('/graphql', { query, variables })
      this.activities = res.data.data.items
      this.headers = [
        {
          text: 'S/N',
          value: 'id'
        },
        {
          text: 'Activity',
          value: 'title'
        },
        {
          text: 'Unit',
          value: 'unitOfMeasurement'
        },
        {
          text: 'Annual Plan',
          value: 'planOfAYear'
        },
        {
          text: 'Semi-Annual Plan',
          value: 'planOfSixMonths'
        },
        {
          text: 'Quarterly Plan',
          value: 'planOfAQuarter'
        },
        {
          text: 'Monthly Plan',
          value: 'planOfAMonth'
        }
      ]
    },
    reportParamsNext() {
      if (this.$refs.showReportForm.validate()) {
        this.activities.forEach((activity) => {
          activity['totalPlanned'] = 0
          activity['totalAccomplishedAmount'] = 0
          activity.dailyActivities.forEach((progress) => {
            activity['totalPlanned'] += parseFloat(progress.planOfADay)
            activity['totalAccomplishedAmount'] += parseFloat(
              progress.accomplishmentAmount
            )
          })
          const tmp = (
            (activity['totalAccomplishedAmount'] / activity['totalPlanned']) *
            100
          ).toFixed(2)
          activity['totalAccomplishedPercentage'] = isNaN(tmp) ? 0 : tmp
        })

        this.headers.push({
          text: 'Total Planned',
          value: 'totalPlanned'
        })
        this.headers.push({
          text: 'Total Accomplished',
          value: 'totalAccomplishedAmount'
        })
        this.headers.push({
          text: 'Performance %',
          value: 'totalAccomplishedPercentage'
        })
        this.$refs.showReportForm.reset()
        this.showReport.dialog = false
        this.downloadButton = true
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
