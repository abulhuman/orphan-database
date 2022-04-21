<template>
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
            <v-btn @click="saveDailyActivity(item)" class="primary">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'
export default {
  props: ['socialWorkerId'],
  data() {
    return {
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
          isNumeric: (v) => /[0-9]/.test(v) || 'Must numeric'
        }
      }
    }
  },
  async created() {
    await this.initialize()
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
          this.dailyActivity.dialog = false;
        this.SET_SNACKBAR(true)
        this.SET_SNACKBAR_COLOR('success')
        this.SET_SNACKBAR_TEXT('Successfully added today\'s progress.')
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
