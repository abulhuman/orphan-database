<template>
  <div style="min-width: 1024px; min-height: 768px">
    <v-row justify="center" no-gutters>
      <v-col cols="9" class="mt-12">
        <v-card elevation="2">
          <!-- TODO implement expanding button into the select-list  -->
          <!-- Social Worker Orphan-list header:filter and search -->
          <!-- <v-row>
            <v-col cols="1" class="mt-4 pt-5">
              <v-btn fab small class="ml-5" elevation="1" right color="#eee">
                <v-icon> mdi-filter </v-icon>
              </v-btn>
            </v-col>
            <v-col class="mt-6">
              <v-select
                v-model="filterValue"
                hint="select field/s to filter explicity"
                :items="filterItems"
                :menu-props="{ bottom: true, offsetY: true }"
                dense
                elevation="1"
                persistent-hint
                multiple
                placeholder="Filter By"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip
                    color="primary"
                    label
                    close
                    close-icon="mdi-close"
                    v-if="index === 0"
                  >
                    <span>{{ item }}</span>
                  </v-chip>
                  <span v-if="index === 1" class="grey--text caption">
                    (+{{ filterValue.length - 1 }} others)
                  </span>
                </template>
              </v-select>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="mt-3">
              <v-text-field v-model="search" placeholder="Search ..." />
            </v-col>
            <v-col cols="1" class="mt-4 mr-3 pt-5">
              <v-btn fab small elevation="1" right color="blue lighten-1">
                <v-icon> mdi-account-search </v-icon>
              </v-btn>
            </v-col> -->
          <v-row>
            <v-col>
              <v-tabs
                v-model="socialWorkerTabs"
                color="primary"
                slider-color="primary"
                fixed-tabs
              >
                <v-tab>My Orphans</v-tab>
                <v-tab>My Activities</v-tab>
              </v-tabs>
              <v-tabs-items v-model="socialWorkerTabs">
                <v-tab-item>
                  <v-row>
                    <v-col>
                      <social-worker-activities
                        :socialWorkerId="socialWorerkId"
                      />
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item>
                  <v-row>
                    <v-col cols="12">
                      <social-worker-orphan-list
                        :socialWorkerId="socialWorerkId"
                      />
                    </v-col> </v-row
                ></v-tab-item>
              </v-tabs-items>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SocialWorkerActivities from './SocialWorkerActivities.vue'
import SocialWorkerOrphanList from './SocialWorkerOrphanList.vue'
export default {
  components: { SocialWorkerOrphanList, SocialWorkerActivities },
  props: ['socialWorerkId'],
  data() {
    return {
      socialWorkerTabs: undefined,
      // used in filter selection items
      filterItems: [
        'ID',
        'Full Name',
        'Age',
        'Gender',
        'Guardian Full Name',
        'Guardian Phone Number',
        'Account Number',
        'District',
        'Village',
        'Donor'
      ],
      filterValue: []
    }
  },
  methods: {}
}
</script>

<style></style>
