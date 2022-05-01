<template>
  <v-data-table
    :headers="headers"
    :items="orphans"
    :items-per-page="itemsPerPage"
    :search="search"
    :custom-filter="searchFilter"
  >
    <template #[`item.actions`]="{ item }">
      <financialRecordsDialog :open="financialRecordsDialog" :item="item" />
      <educational-records-dialog
        :open="educationalRecordsDialog"
        :item="item"
        :isEditable="true"
        :isOrphanDetail="false"
      />
      <insert-images-dialog :open="insertImagesDialog" :item="item" />
      <miscellaneous-social-worker-tasks-dialog
        :open="miscellaneousSocialWorkerTasksDialog"
        :item="item"
        @addedSuccessfully="initialize()"
      />
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'
import { capitalize, calculateAge } from '@/utils/utils'
import InsertImagesDialog from './InsertImagesDialog.vue'
import EducationalRecordsDialog from './EducationalRecordsDialog.vue'
import MiscellaneousSocialWorkerTasksDialog from './MiscellaneousSocialWorkerTasksDialog.vue'
import FinancialRecordsDialog from './FinancialRecordsDialog.vue'
export default {
  props: ['socialWorkerId'],
  components: {
    InsertImagesDialog,
    EducationalRecordsDialog,
    MiscellaneousSocialWorkerTasksDialog,
    FinancialRecordsDialog
  },
  data() {
    return {
      // used for filter selection
      // table headers if that wasn't clear enough LOL
      headers: [
        { text: 'ID', value: 'id' },
        {
          text: 'Full Name',
          align: 'start',
          value: 'fullName'
        },
        {
          text: 'Age',
          value: 'age'
        },
        {
          text: 'Gender',
          value: 'gender'
        },
        {
          text: 'Guardian Full Name',
          value: 'guardianFullName'
        },
        {
          text: 'Guardian Mobile Number',
          value: 'guardianMobileNumber'
        },
        {
          text: 'Account Number',
          value: 'accountNumber'
        },
        {
          text: 'Village',
          align: 'Start',
          value: 'village'
        },
        {
          text: 'Actions',
          value: 'actions'
        }
      ],
      orphans: [],
      itemsPerPage: 20,
      search: '',
      financialRecordsDialog: false,
      educationalRecordsDialog: false,
      insertImagesDialog: false,
      miscellaneousSocialWorkerTasksDialog: false
    }
  },
  created() {
    this.initialize()
  },
  methods: {
    ...mapMutations([
      'SET_SNACKBAR',
      'SET_SNACKBAR_COLOR',
      'SET_SNACKBAR_TEXT'
    ]),
    // custom search function based on selected columns
    searchFilter(value, search, item) {
      if (search.length > 0) {
        if (this.filterValue.length > 0) {
          for (const filterVal of this.filterValue) {
            if (filterVal === this.headers[0].text) {
              // filter by id only
              return item.id.indexOf(search) !== -1
            } else if (filterVal === this.headers[1].text) {
              // filter by full name only
              return (
                item.fullName.toLowerCase().indexOf(search.toLowerCase()) !== -1
              )
            } else if (filterVal === this.headers[2].text) {
              // filter by age only, N.B.: '0' , '<1' & '< 1' gives all marked by < 1
              return (
                item.age === parseInt(search) ||
                ((search == 0 || search == `< 1` || search == `<1`) &&
                  item.age === `< 1`)
              )
            } else if (filterVal === this.headers[3].text) {
              // filter by gender only
              return (
                item.gender.toLowerCase().indexOf(search.toLowerCase()) !== -1
              )
            } else if (filterVal === this.headers[4].text) {
              // filter by guardian full name only
              return (
                item.guardianFullName
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              )
            } else if (filterVal === this.headers[5].text) {
              // filter by guardian mobile number only
              return (
                item.guardianMobileNumber
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              )
            } else if (filterVal === this.headers[6].text) {
              // filter by account number only
              return (
                item.accountNumber
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              )
            } else if (filterVal === this.headers[7].text) {
              // filter by district name only
              return (
                item.district.toLowerCase().indexOf(search.toLowerCase()) !== -1
              )
            } else if (filterVal === this.headers[8].text) {
              // filter by village name only
              return (
                item.village.toLowerCase().indexOf(search.toLowerCase()) !== -1
              )
            } else if (filterVal === this.headers[9].text) {
              // filter by donor name initals only
              return (
                item.donor.toLowerCase().indexOf(search.toLowerCase()) !== -1
              )
            }
          }
        } else {
          // default search by full name
          return (
            item.fullName != null &&
            typeof item.fullName === 'string' &&
            item.fullName
              .toString()
              .toLowerCase()
              .indexOf(search) !== -1
          )
        }
      }
    },
    initialize() {
      let { id } = this.$route.params
      ;(async () => {
        try {
          const query = `query socialWorker($id: ID!) {
                    socialWorker(id: $id) {
                      id
                      orphans {
                        id
                        firstName
                        father {
                          firstName
                          lastName
                        }
                        dateOfBirth
                        gender
                        guardian {
                          firstName
                          middleName
                          lastName
                          mobileNumber
                        }
                        accountNumber
                        village {
                          id
                          name
                          district {
                            id
                            name
                          }
                        }
                      }
                    }
                  }`
          const requestOptions = { query, variables: { id } }
          const res = await axios.post('/graphql', requestOptions)
          if (res.data.errors?.length) {
            throw new Error(res.data.errors[0].message)
          } else {
            const { socialWorker } = res.data.data

            let formattedOrphans = socialWorker.orphans.map((item) => {
              return {
                id: item.id,
                fullName: `${capitalize(item.firstName)} ${capitalize(
                  item.father.firstName
                )} ${capitalize(item.father.lastName)}`,
                age: calculateAge(item.dateOfBirth),
                gender: item.gender,
                guardianFullName: `${capitalize(
                  item.guardian.firstName
                )} ${capitalize(item.guardian.middleName)} ${capitalize(
                  item.guardian.lastName
                )}`,
                guardianMobileNumber: item.guardian.mobileNumber,
                accountNumber: item.accountNumber,
                district: item.village.district.name,
                village: item.village.name
              }
            })

            formattedOrphans.sort((a, b) => a.id - b.id)

            this.orphans = formattedOrphans
          }
        } catch (error) {
          this.SET_SNACKBAR(true)
          this.SET_SNACKBAR_COLOR('error')
          this.SET_SNACKBAR_TEXT('Server error. Reload the page and try again.')
          console.error(error)
        }
      })()
    },
    showInsertImagesDialog(item) {
      return item.id
    }
  }
}
</script>
