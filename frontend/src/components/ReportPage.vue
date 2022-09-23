<template>
  <div>
    <v-row justify="center">
      <v-col class="mt-15">
        <v-card
          class="mx-auto mt-8"
          min-width="500"
          max-width="90%"
          height="100%"
          ><v-card-title>
            <h1>Report Page</h1>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col>
                <v-form v-if="!showReport">
                  <v-card elevation="0" max-width="500" class="ml-5">
                    <v-select
                      :items="[
                        {
                          text: 'Status Report (Includes Termination Report)',
                          value: 'status-report'
                        }
                      ]"
                      v-model="selected"
                      @change="changedCategory"
                      label="Select a Report Category"
                    ></v-select>
                    <!-- { text: 'Donor', value: 'donor' }, -->
                    <!-- { text: 'Project', value: 'project' } -->
                    <v-select
                      :items="['Donor', 'Project']"
                      v-model="grouping"
                      label="Select Report Grouping"
                      @change="changedGrouping"
                    ></v-select>
                    <v-select
                      :items="beneficiaries"
                      v-model="beneficiaryId"
                      :label="`Select ${grouping}`"
                    ></v-select>
                    <v-select
                      :items="[
                        { text: 'New', value: 'new' },
                        { text: 'Pending', value: 'pending' },
                        { text: 'Processing', value: 'processing' },
                        { text: 'Active', value: 'active' },
                        // ?todo { text: 'In-Active', value: 'in-active' },
                        { text: 'Graduated', value: 'graduated' }
                        // ?todo { text: 'Terminated', value: 'terminated' }
                      ]"
                      v-model="status"
                      label="Select Orphan Status"
                    ></v-select>
                    <v-btn @click="generate">Generate</v-btn></v-card
                  >
                </v-form>
                <orphan-table
                  v-else
                  :orphans="orphans"
                  @back="showReport = false"
                />
              </v-col>
            </v-row> </v-card-text
        ></v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import OrphanTable from '../components/Report/OrphanTable.vue'
export default {
  components: { OrphanTable },
  created() {
    // console.log(this)
  },
  data() {
    return {
      showReport: false,
      selected: 'status-report',
      grouping: 'Donor', //'Beneficiary',
      beneficiaries: [],
      beneficiaryId: null,
      status: 'new', //null,
      orphans: []
    }
  },
  methods: {
    changedCategory() {
      console.log(this.selected)
    },
    async getDonors() {
      const query = `
              query GetAllDonors {
                getAllDonors {
                  id
                  companyName
                  nameInitials
                  }
                }`
      try {
        const donors = await axios.post('/graphql', { query })
        if (donors.data.errors?.length)
          throw new Error(donors.data.errors[0].message)
        return donors.data.data.getAllDonors.map((v) => ({
          text: v.nameInitials,
          value: v.id
        }))
      } catch (error) {
        console.log(error)
      }
    },
    async getProjects() {
      const query = `query GetAllProjects {
                        getAllProjects{
                          id
                          number
                        }
                      }`
      try {
        const projects = await axios.post('/graphql', { query })
        if (projects.data.errors?.length)
          throw new Error(projects.data.errors[0].message)
        return projects.data.data.getAllProjects.map((v) => ({
          text: `Number #${v.number}`,
          value: v.id
        }))
      } catch (error) {
        console.log(error)
      }
    },
    async getBeneficiariesItems() {
      return this.grouping === 'Donor'
        ? await this.getDonors()
        : await this.getProjects()
    },
    async changedGrouping() {
      this.beneficiaries = await this.getBeneficiariesItems(this.grouping)
    },
    changedStatus() {
      console.log(this.selected)
    },
    async generate() {
      console.log(this.beneficiaryId)
      console.log('Generator go BRRRRRRRRRRRRRRRRRRRRR')
      const query = `
          query OSR(
              $beneficiaryId: ID!
              $status: SponsorshipStatusEnum
              $reportBeneficiary: ReportBeneficiaryEnum
                ) {
                  generateOrphanStatusReport(
                    beneficiaryId: $beneficiaryId
                    status: $status
                    reportBeneficiary: $reportBeneficiary
                  ) {
                    id
                    orphanCode
                    firstName
                    father{firstName lastName}
                    guardian{firstName middleName lastName}
                    gender
                    cod: currentOrphanData{
                      ss: sponsorshipStatus
                    }
                    #financialRecords {
                    #  amount
                    #}
                  }
                }
      `
      const variables = {
        beneficiaryId: this.beneficiaryId,
        status: this.status,
        reportBeneficiary: this.grouping.toUpperCase()
      }
      console.log({ variables })
      try {
        const orphans = await axios.post('/graphql', { query, variables })
        if (orphans.data.errors?.length)
          throw new Error(orphans.data.errors[0].message)
        this.orphans = orphans.data.data.generateOrphanStatusReport
        this.showReport = true
        console.log(this.orphans)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
