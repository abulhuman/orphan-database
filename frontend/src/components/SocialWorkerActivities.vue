<template>
  <v-card>
    <v-card-title>
      Project Activities
      <v-spacer></v-spacer>
      <v-dialog
        max-width="750px"
        v-model="newProjectActivity.dialog"
        transition="dialog-transition"
      >
        <template #activator="{on,attrs}">
          <v-btn v-on="on" v-bind="attrs" small color="primary darken-3">
            <v-icon dense class="mr-2">mdi-plus</v-icon> New
          </v-btn>
        </template>
        <v-card>
          <v-card-title primary-title>
            Add New Project Activity
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form class="mx-3" lazy-validation ref="newProjectActivityForm">
              <v-row>
                <v-col class="mx-n2"
                  ><v-text-field
                    name="title"
                    label="Title"
                    :rules="[rules.numberRules.required]"
                    id="title"
                    v-model="newProjectActivity.title"
                  ></v-text-field
                ></v-col>
                <v-col class="mx-n2"
                  ><v-text-field
                    name="category"
                    label="Category"
                    :rules="[rules.numberRules.required]"
                    id="category"
                    v-model="newProjectActivity.category"
                  ></v-text-field
                ></v-col>
                <v-col class="mx-n2"
                  ><v-text-field
                    name="unitOfMeasrurement"
                    label="Unit of Measurement"
                    :rules="[rules.numberRules.required]"
                    id="unitOfMeasrurement"
                    v-model="newProjectActivity.unitOfMeasurement"
                  ></v-text-field></v-col
              ></v-row>
              <v-row>
                <v-col class="mx-n2"
                  ><v-text-field
                    name="planOfAYear"
                    label="Plan of a Year"
                    :rules="[
                      rules.numberRules.required,
                      rules.numberRules.isNumeric
                    ]"
                    id="planOfAYear"
                    v-model="newProjectActivity.planOfAYear"
                  ></v-text-field
                ></v-col>
                <v-col class="mx-n2"
                  ><v-text-field
                    name="planOfSixMonths"
                    label="Plan of 6 Months"
                    :rules="[
                      rules.numberRules.required,
                      rules.numberRules.isNumeric
                    ]"
                    id="planOfSixMonths"
                    v-model="newProjectActivity.planOfSixMonths"
                  ></v-text-field
                ></v-col>
                <v-col class="mx-n2"
                  ><v-text-field
                    name="planOfAQuarter"
                    label="Plan of a Quarter"
                    :rules="[
                      rules.numberRules.required,
                      rules.numberRules.isNumeric
                    ]"
                    id="planOfAQuarter"
                    v-model="newProjectActivity.planOfAQuarter"
                  ></v-text-field
                ></v-col>
              </v-row>
              <v-row>
                <v-col class="mx-n2"
                  ><v-text-field
                    name="planOfAMonth"
                    label="Plan of a Month"
                    :rules="[
                      rules.numberRules.required,
                      rules.numberRules.isNumeric
                    ]"
                    id="planOfAMonth"
                    v-model="newProjectActivity.planOfAMonth"
                  ></v-text-field
                ></v-col>
                <v-col class="mx-n2"
                  ><v-text-field
                    name="planOfADay"
                    label="Plan of a Day"
                    :rules="[
                      rules.numberRules.required,
                      rules.numberRules.isNumeric
                    ]"
                    id="planOfADay"
                    v-model="newProjectActivity.planOfADay"
                  ></v-text-field
                ></v-col>
                <v-col class="mx-n2"
                  ><v-select
                    name="project"
                    label="Project"
                    :items="newProjectActivity.projects"
                    :rules="[rules.numberRules.required]"
                    id="project"
                    v-model="newProjectActivity.project"
                  ></v-select></v-col></v-row
            ></v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer />
            <v-btn
              @click="newProjectActivity.dialog = !newProjectActivity.dialog"
              class="secondary lighten-2"
              >Cancel</v-btn
            >
            <v-btn @click="saveNewProjectActivity()" class="primary"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="activities"
      hide-default-footer
      class="elevation-1 mt-2"
      item-key="id"
      loading="true"
      dense
      group-by="category"
      ><template #[`item.actions`]="{item}" :item="item">
        <v-dialog
          v-model="dailyActivity.dialog"
          max-width="350px"
          transition="dialog-transition"
        >
          <template #activator="{on,attrs}">
            <v-btn v-on="on" v-bind="attrs" class="primary" small>ADD</v-btn>
          </template>
          <v-card>
            <v-card-title primary-title>
              Daily Activity Progress Report
            </v-card-title>
            <v-card-text>
              <v-form class="mx-3" lazy-validation ref="dailyActivityForm">
                <v-row>
                  <v-text-field
                    name="planOfADay"
                    label="Plan of a Day"
                    id="planOfADay"
                    v-model="dailyActivity.planOfADay"
                    :rules="[
                      rules.numberRules.required,
                      rules.numberRules.isNumeric
                    ]"
                  ></v-text-field> </v-row
                ><v-row>
                  <v-text-field
                    name="accomplishmentAmount"
                    label="Accomplishment Amount"
                    id="accomplishmentAmount"
                    v-model="dailyActivity.accomplishmentAmount"
                    :rules="[
                      rules.numberRules.required,
                      rules.numberRules.isNumeric
                    ]"
                  ></v-text-field>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                @click="dailyActivity.dialog = !dailyActivity.dialog"
                class="secondary lighten-2"
                >Cancel</v-btn
              >
              <v-btn @click="saveDailyActivity(item)" class="primary"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'
export default {
  props: ['socialWorkerId'],
  data() {
    return {
      newProjectActivity: {
        dialog: false,
        projects: null,
        title: null,
        category: null,
        unitOfMeasurement: null,
        planOfAYear: null,
        planOfSixMonths: null,
        planOfAQuarter: null,
        planOfAMonth: null,
        planOfADay: null,
        project: null
      },
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
        },
        {
          text: 'Daily Progress',
          value: 'actions'
        }
      ],
      dailyActivity: {
        dialog: false,
        planOfADay: null,
        accomplishmentAmount: null
      },
      rules: {
        numberRules: {
          required: (v) => !!v || 'Required',
          isNumeric: (v) => /[0-9]/.test(v) || 'Must be numeric'
        }
      }
    }
  },
  async created() {
    await this.initialize()
    await this.initializeNewProjectActivityForm()
  },
  methods: {
    ...mapMutations([
      'SET_SNACKBAR',
      'SET_SNACKBAR_COLOR',
      'SET_SNACKBAR_TEXT'
    ]),
    async initialize() {
      const query = `query GetSWActivities($socialWorkerId: ID!) {
                    activities: getProjectActivitiesBySocialWorkerId(socialWorkerId: $socialWorkerId) {
                        id
                        title
                        category
                        unitOfMeasurement
                        planOfAYear
                        planOfSixMonths
                        planOfAQuarter
                        planOfAMonth
                        dailyActivities {
                            planOfADay
                            accomplishmentPercentage
                            accomplishmentAmount
                        }
                        project {
                            location {
                                villageName: name
                                district {
                                districtName: name
                                }
                            }
                        }
                    }
                }`
      try {
        const activitiesResponse = await axios.post('/graphql', {
          query,
          variables: { socialWorkerId: this.socialWorkerId }
        })
        if (activitiesResponse.data.errors?.length) {
          throw new Error(activitiesResponse.data.errors[0].message)
        } else {
          const { activities } = activitiesResponse.data.data
          this.activities = activities
        }
      } catch (error) {
        this.SET_SNACKBAR(true)
        this.SET_SNACKBAR_COLOR('error')
        this.SET_SNACKBAR_TEXT('Server error. Reload the page and try again.')
        console.error(error)
      }
    },
    async saveDailyActivity(item) {
      if (!this.$refs.dailyActivityForm.validate()) return
      const variables = {
        planOfADay: parseFloat(this.dailyActivity.planOfADay),
        accomplishmentAmount: parseFloat(
          this.dailyActivity.accomplishmentAmount
        ),
        accomplishmentPercentage: parseFloat(
          this.dailyActivity.accomplishmentAmount /
            this.dailyActivity.planOfADay
        ),
        projectActivityId: item.id,
        socialWorkerId: this.socialWorkerId
      }
      const query = `mutation CreateDailyActivity(
                        $planOfADay: Float!
                        $accomplishmentAmount: Float!
                        $accomplishmentPercentage: Float!
                        $projectActivityId: ID!
                        ) {
                        createDailyActivity(
                            input: {
                                planOfADay: $planOfADay
                                accomplishmentAmount: $accomplishmentAmount
                                accomplishmentPercentage: $accomplishmentPercentage
                                projectActivityId: $projectActivityId
                                }
                            ) {
                                id
                                planOfADay
                                accomplishmentAmount
                                accomplishmentPercentage
                            }
                        }`
      try {
        const createDailyActivityResponse = await axios.post('/graphql', {
          query,
          variables
        })
        if (createDailyActivityResponse.data.errors?.length)
          throw new Error(createDailyActivityResponse.data.errors[0].message)
        this.$refs.dailyActivityForm.reset()
        this.dailyActivity.dialog = false
        this.SET_SNACKBAR(true)
        this.SET_SNACKBAR_COLOR('success')
        this.SET_SNACKBAR_TEXT("Successfully added today's progress.")
      } catch (error) {
        this.SET_SNACKBAR(true)
        this.SET_SNACKBAR_COLOR('error')
        this.SET_SNACKBAR_TEXT('Server error. Reload the page and try again.')
        console.error(error)
      }
    },
    async initializeNewProjectActivityForm() {
      const query = `{
                      projects: getAllProjects {
                        id
                        number
                      }
                    }`
      try {
        const allProjectsResponse = await axios.post('/graphql', { query })

        if (allProjectsResponse.data.errors?.length) {
          throw new Error(allProjectsResponse.data.errors[0].message)
        } else {
          const { projects } = allProjectsResponse.data.data
          this.newProjectActivity.projects = projects.map((project) => ({
            value: project,
            text: `Project ${project.number}`
          }))
        }
      } catch (error) {
        this.SET_SNACKBAR(true)
        this.SET_SNACKBAR_COLOR('error')
        this.SET_SNACKBAR_TEXT('Server error. Reload the page and try again.')
        console.error(error)
      }
    },
    async saveNewProjectActivity() {
      if (!this.$refs.newProjectActivityForm.validate()) return
      const query = `mutation CreateNewProjectActivity(
                    $title: String!
                    $category: String!
                    $unitOfMeasurement: String!
                    $planOfAYear: String!
                    $planOfSixMonths: String!
                    $planOfAQuarter: String!
                    $planOfAMonth: String!
                    $socialWorkerId: ID!
                    $projectId: ID!
                  ) {
                    newActivity: createProjectActivity(
                      input: {
                        title: $title
                        category: $category
                        unitOfMeasurement: $unitOfMeasurement
                        planOfAYear: $planOfAYear
                        planOfSixMonths: $planOfSixMonths
                        planOfAQuarter: $planOfAQuarter
                        planOfAMonth: $planOfAMonth
                        socialWorkerId: $socialWorkerId
                        projectId: $projectId
                      }
                    ) {
                      id
                      title
                      category
                      unitOfMeasurement
                      planOfAYear
                      planOfSixMonths
                      planOfAQuarter
                      planOfAMonth
                      dailyActivities {
                        planOfADay
                        accomplishmentPercentage
                        accomplishmentAmount
                      }
                      project {
                        location {
                          villageName: name
                          district {
                            districtName: name
                          }
                        }
                      }
                    }
                  }`
      const variables = {}
      Object.assign(variables, this.newProjectActivity)
      variables['projectId'] = variables['project'].id
      variables['socialWorkerId'] = this.socialWorkerId

      delete variables['dialog']
      delete variables['projects']
      delete variables['project']
      try {
        const newProjectActivityResponse = await axios.post('/graphql', {
          query,
          variables
        })

        if (newProjectActivityResponse.data.errors?.length) {
          throw new Error(newProjectActivityResponse.data.errors[0].message)
        } else {
          const { newActivity } = newProjectActivityResponse.data.data
          console.log(newActivity)
          this.activities.push(newActivity)
        }
      } catch (error) {
        this.SET_SNACKBAR(true)
        this.SET_SNACKBAR_COLOR('error')
        this.SET_SNACKBAR_TEXT('Server error. Reload the page and try again.')
        console.error(error)
      }
    }
  }
}
</script>

<style></style>
