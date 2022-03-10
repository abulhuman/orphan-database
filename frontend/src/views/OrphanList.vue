<template style="positon: relative;">
  <!-- TODO: # add new orphan adding functionality -->
  <v-row justify="center" no-gutters>
    <!-- Table Card -->
    <!-- TODO: # add a details column -->
    <!--       # impliment editable fullName * NEW FEATURE * -->
    <!--       # impliment a custom pagination -->
    <v-col cols="9" style="margin-top: 7rem">
      <v-card>
        <v-row>
          <v-col cols="12" class="d-flex pb-0">
            <!-- back Button -->
            <v-col>
              <v-btn fab small class="ml-4" @click="goToCoordinatorTable()">
                <v-icon> mdi-arrow-left </v-icon>
              </v-btn>
            </v-col>
            <!-- Select Orphan -->
            <v-col>
              <v-btn class="primary" @click="selectOrphans">
                {{ orphanSelectBtnLable }}
              </v-btn>
              <v-dialog
                v-model="showDonorSelectionDialog"
                width="30%"
                persistent
              >
                <v-card>
                  <v-card-title class="justify-center">
                    Choose Donor
                  </v-card-title>
                  <v-form ref="donorSelect" v-model="validDonorChoice">
                    <v-responsive
                      min-width="200"
                      max-width="200"
                      class="pl-0 mx-auto"
                    >
                      <v-select
                        v-model="selectedOrphanDonor"
                        :items="selectedOrphanDonorOptions"
                        item-text="nameInitials"
                        item-value="nameInitials"
                        :menu-props="{ bottom: true, offsetY: true }"
                        solo
                        outlined
                        dense
                        :rules="[rules.required]"
                      >
                      </v-select>
                    </v-responsive>
                  </v-form>
                  <v-card-actions class="justify-end">
                    <v-btn text class="red--text" @click="cancelOrphanChoice"
                      >Cancel</v-btn
                    >
                    <v-btn
                      text
                      class="primary--text"
                      @click="chooseOrphans"
                      :disabled="!validDonorChoice"
                      >Confirm</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-col>
          <v-col cols="12">
            <v-expansion-panels popout v-model="orphanPanel">
              <!-- New -->
              <v-expansion-panel>
                <v-expansion-panel-header @click="updateOrphanList">
                  <template v-slot:default="{ open }">
                    <v-row no-gutters>
                      <v-col cols="4"> New </v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0"></span>
                          <span v-else key="1"></span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card elevation="16">
                    <v-sheet
                      id="scrolling-techniques-3"
                      class="overflow-y-auto"
                      max-height="56vh"
                    >
                      <v-data-table
                        v-model="selectedOrphans"
                        :headers="headers"
                        :items="newOrphans"
                        item-key="id"
                        :search="newSearch"
                        append-icon="mdi-magnify"
                        :custom-filter="newSearchFilter"
                        :show-select="orphanShow"
                        multi-sort
                        class="elevation-1"
                      >
                        <template v-slot:top>
                          <v-row style="margin: 0px">
                            <!-- Filter/Search Selection -->
                            <!-- TODO: # add close icon and function to remove from selection -->
                            <!--       # add tooltip maybe -->
                            <v-col
                              sm="5"
                              offset="0"
                              offset-sm="0"
                              offset-md="0"
                              class="mt-4 mt-sm-0"
                            >
                              <v-responsive
                                min-width="300"
                                max-width="300"
                                class="mx-xs-auto ml-sm-auto mt-sm-2"
                              >
                                <v-select
                                  v-model="newFilterValue"
                                  hint="select field/s to filter explicity"
                                  :items="newFilterItems"
                                  :menu-props="{ bottom: true, offsetY: true }"
                                  solo
                                  outlined
                                  dense
                                  persistent-hint
                                  multiple
                                  placeholder="Filter By"
                                >
                                  <template v-slot:selection="{ item, index }">
                                    <v-chip
                                      color="primary"
                                      dark
                                      label
                                      close
                                      close-icon="mdi-close-outline"
                                      @click:close="removeSelectedNew(item)"
                                      v-if="index === 0"
                                    >
                                      <span>{{ item }}</span>
                                    </v-chip>
                                    <span
                                      v-if="index === 1"
                                      class="grey--text caption"
                                    >
                                      (+{{ newFilterValue.length - 1 }}
                                      others)
                                    </span>
                                  </template>
                                </v-select>
                              </v-responsive>
                            </v-col>
                            <!-- Search Input -->
                            <!-- TODO: # add search icon and close icon -->
                            <v-col
                              sm="7"
                              md="4"
                              offset="1"
                              offset-sm="3"
                              offset-md="1"
                              offset-lg="0"
                            >
                              <v-responsive
                                max-width="300"
                                class="ml-sm-3 mt-sm-4"
                              >
                                <v-text-field
                                  v-model="newSearch"
                                  placeholder="Search"
                                  dense
                                  flat
                                  clearable
                                  append-icon="mdi-filter-minus"
                                >
                                  <template v-slot:prepend> </template>
                                </v-text-field>
                              </v-responsive>
                            </v-col>
                          </v-row>
                        </template>
                        <template v-slot:item.fullName="{ item }">
                          {{ fullName(item) }}
                        </template>
                        <template v-slot:item.age="{ item }">
                          {{ calcAge(item) }}
                        </template>
                        <template v-slot:item.sponsorshipStatus="{ item }">
                          {{ calcSponsorshipStatus(item) }}
                        </template>
                        <!-- TODO # fix this coz this is done not to change the header array of objects -->
                        <template v-slot:header.sponsoredDate="{ header }">
                          {{ changeSponsoredDateHeaderOfNew(header) }}
                        </template>
                        <template v-slot:item.sponsoredDate="{ item }">
                          {{ displayOrphanRegistrationDate(item) }}
                        </template>
                        <template v-slot:item.details="{ item }">
                          <orphan-detail :details="item" user="coordinator" />
                        </template>
                      </v-data-table>
                      <!-- becomes visble when full name is edited -->
                      <!-- TODO: # Impliment a loding functionality -->
                      <!--       # maybe server side validation also -->
                      <v-snackbar
                        v-model="snack"
                        :timeout="3000"
                        :color="snackColor"
                      >
                        {{ snackText }}

                        <template v-slot:action="{ attrs }">
                          <v-btn v-bind="attrs" text @click="snack = false">
                            Close
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </v-sheet>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <!-- Processing -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <template v-slot:default="{ open }">
                    <v-row no-gutters>
                      <v-col cols="4"> Processing </v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0"></span>
                          <span v-else key="1"></span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card elevation="16">
                    <v-sheet
                      id="scrolling-techniques-3"
                      class="overflow-y-auto"
                      max-height="56vh"
                    >
                      <v-data-table
                        :headers="headers"
                        :items="processingOrphans"
                        item-key="id"
                        :search="processingSearch"
                        append-icon="mdi-magnify"
                        :custom-filter="processingSearchFilter"
                        :show-select="orphanShow"
                        multi-sort
                        class="elevation-1"
                      >
                        <template v-slot:top>
                          <v-row style="margin: 0px">
                            <!-- Filter/Search Selection -->
                            <!-- TODO: # add close icon and function to remove from selection -->
                            <!--       # add tooltip maybe -->
                            <v-col
                              sm="5"
                              offset="0"
                              offset-sm="0"
                              offset-md="0"
                              class="mt-4 mt-sm-0"
                            >
                              <v-responsive
                                min-width="300"
                                max-width="300"
                                class="mx-xs-auto ml-sm-auto mt-sm-2"
                              >
                                <v-select
                                  v-model="processingFilterValue"
                                  hint="select field/s to filter explicity"
                                  :items="processingFilterItems"
                                  :menu-props="{ bottom: true, offsetY: true }"
                                  solo
                                  outlined
                                  dense
                                  persistent-hint
                                  multiple
                                  placeholder="Filter By"
                                >
                                  <template v-slot:selection="{ item, index }">
                                    <v-chip
                                      color="primary"
                                      dark
                                      label
                                      close
                                      close-icon="mdi-close-outline"
                                      @click:close="
                                        removeSelectedProcessing(item)
                                      "
                                      v-if="index === 0"
                                    >
                                      <span>{{ item }}</span>
                                    </v-chip>
                                    <span
                                      v-if="index === 1"
                                      class="grey--text caption"
                                    >
                                      (+{{ processingFilterValue.length - 1 }}
                                      others)
                                    </span>
                                  </template>
                                </v-select>
                              </v-responsive>
                            </v-col>
                            <!-- Search Input -->
                            <!-- TODO: # add search icon and close icon -->
                            <v-col
                              sm="7"
                              md="4"
                              offset="1"
                              offset-sm="3"
                              offset-md="1"
                              offset-lg="0"
                            >
                              <v-responsive
                                max-width="300"
                                class="ml-sm-3 mt-sm-4"
                              >
                                <v-text-field
                                  v-model="processingSearch"
                                  placeholder="Search"
                                  dense
                                  flat
                                  clearable
                                  append-icon="mdi-filter-minus"
                                >
                                  <template v-slot:prepend> </template>
                                </v-text-field>
                              </v-responsive>
                            </v-col>
                          </v-row>
                        </template>
                        <template v-slot:item.fullName="{ item }">
                          {{ fullName(item) }}
                        </template>
                        <template v-slot:item.age="{ item }">
                          {{ calcAge(item) }}
                        </template>
                        <template v-slot:item.sponsorshipStatus="{ item }">
                          {{ calcSponsorshipStatus(item) }}
                        </template>
                        <!-- TODO # fix this coz this is done not to change the header array of objects -->
                        <template v-slot:header.sponsoredDate="{ header }">
                          {{
                            changeSponsoredDateHeaderOfPendingAndProcessing(
                              header
                            )
                          }}
                        </template>
                        <template v-slot:item.sponsoredDate="{ item }">
                          {{ displaySponsoringOrphanDonor(item) }}
                        </template>
                        <template v-slot:item.details="{ item }">
                          <orphan-detail :details="item" user="coordinator" />
                        </template>
                      </v-data-table>
                      <!-- becomes visble when full name is edited -->
                      <!-- TODO: # Impliment a loding functionality -->
                      <!--       # maybe server side validation also -->
                      <v-snackbar
                        v-model="snack"
                        :timeout="3000"
                        :color="snackColor"
                      >
                        {{ snackText }}

                        <template v-slot:action="{ attrs }">
                          <v-btn v-bind="attrs" text @click="snack = false">
                            Close
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </v-sheet>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <!-- Pending -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <template v-slot:default="{ open }">
                    <v-row no-gutters>
                      <v-col cols="4"> Pending </v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0"></span>
                          <span v-else key="1"></span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card elevation="16">
                    <v-sheet
                      id="scrolling-techniques-3"
                      class="overflow-y-auto"
                      max-height="56vh"
                    >
                      <v-data-table
                        :headers="headers"
                        :items="pendingOrphans"
                        item-key="id"
                        :search="pendingSearch"
                        append-icon="mdi-magnify"
                        :custom-filter="pendingSearchFilter"
                        multi-sort
                        class="elevation-1"
                      >
                        <template v-slot:top>
                          <v-row style="margin: 0px">
                            <!-- Filter/Search Selection -->
                            <!-- TODO: # add close icon and function to remove from selection -->
                            <!--       # add tooltip maybe -->
                            <v-col
                              sm="5"
                              offset="0"
                              offset-sm="0"
                              offset-md="0"
                              class="mt-4 mt-sm-0"
                            >
                              <v-responsive
                                min-width="300"
                                max-width="300"
                                class="mx-xs-auto ml-sm-auto mt-sm-2"
                              >
                                <v-select
                                  v-model="pendingFilterValue"
                                  hint="select field/s to filter explicity"
                                  :items="pendingFilterItems"
                                  :menu-props="{ bottom: true, offsetY: true }"
                                  solo
                                  outlined
                                  dense
                                  persistent-hint
                                  multiple
                                  placeholder="Filter By"
                                >
                                  <template v-slot:selection="{ item, index }">
                                    <v-chip
                                      color="primary"
                                      dark
                                      label
                                      close
                                      close-icon="mdi-close-outline"
                                      @click:close="removeSelectedPending(item)"
                                      v-if="index === 0"
                                    >
                                      <span>{{ item }}</span>
                                    </v-chip>
                                    <span
                                      v-if="index === 1"
                                      class="grey--text caption"
                                    >
                                      (+{{ pendingFilterValue.length - 1 }}
                                      others)
                                    </span>
                                  </template>
                                </v-select>
                              </v-responsive>
                            </v-col>
                            <!-- Search Input -->
                            <!-- TODO: # add search icon and close icon -->
                            <v-col
                              sm="7"
                              md="4"
                              offset="1"
                              offset-sm="3"
                              offset-md="1"
                              offset-lg="0"
                            >
                              <v-responsive
                                max-width="300"
                                class="ml-sm-3 mt-sm-4"
                              >
                                <v-text-field
                                  v-model="pendingSearch"
                                  placeholder="Search"
                                  dense
                                  flat
                                  clearable
                                  append-icon="mdi-filter-minus"
                                >
                                  <template v-slot:prepend> </template>
                                </v-text-field>
                              </v-responsive>
                            </v-col>
                          </v-row>
                        </template>
                        <!-- edit dialog pop-up for Full Name column -->
                        <!-- TODO: impliment this functionality for all the other columns if needed -->
                        <template v-slot:item.fullName="props">
                          <!-- "large" for the buttons, "persistent" for blocking closing of edit-dialog when clicked outside -->
                          <v-edit-dialog
                            :return-value.sync="props.item.fullName"
                            large
                            persistent
                            cancel-text="Cancel"
                            save-text="Save"
                            @save="save"
                            @cancel="cancel"
                            @open="open"
                            @close="close"
                          >
                            {{ props.item.fullName }}
                            <template v-slot:input>
                              <v-text-field
                                v-model="props.item.fullName"
                                :rules="[max25chars]"
                                label="Edit"
                                single-line
                                counter
                                autofocus
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </template>
                        <!-- edit dialog pop-up for Sponsorship Status column -->
                        <template v-slot:item.sponsorshipStatus="props">
                          <v-edit-dialog
                            :return-value.sync="props.item.sponsorshipStatus"
                            large
                            persistent
                            cancel-text="Cancel"
                            save-text="Save"
                            @save="save"
                            @cancel="cancel"
                            @open="open"
                            @close="close"
                          >
                            {{ props.item.sponsorshipStatus }}
                            <template v-slot:input>
                              <v-text-field
                                v-model="props.item.sponsorshipStatus"
                                :rules="[max25chars]"
                                label="Edit"
                                single-line
                                counter
                                autofocus
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </template>
                        <template v-slot:item.fullName="{ item }">
                          {{ fullName(item) }}
                        </template>
                        <template v-slot:item.age="{ item }">
                          {{ calcAge(item) }}
                        </template>
                        <template v-slot:item.sponsorshipStatus="{ item }">
                          {{ calcSponsorshipStatus(item) }}
                        </template>
                        <!-- TODO # fix this coz this is done not to change the header array of objects -->
                        <template v-slot:header.sponsoredDate="{ header }">
                          {{
                            changeSponsoredDateHeaderOfPendingAndProcessing(
                              header
                            )
                          }}
                        </template>
                        <template v-slot:item.sponsoredDate="{ item }">
                          {{ displaySponsoringOrphanDonor(item) }}
                        </template>
                        <template v-slot:item.details="{ item }">
                          <orphan-detail :details="item" user="coordinator" />
                        </template>
                      </v-data-table>
                      <!-- becomes visble when full name is edited -->
                      <!-- TODO: # Impliment a loding functionality -->
                      <!--       # maybe server side validation also -->
                      <v-snackbar
                        v-model="snack"
                        :timeout="3000"
                        :color="snackColor"
                      >
                        {{ snackText }}

                        <template v-slot:action="{ attrs }">
                          <v-btn v-bind="attrs" text @click="snack = false">
                            Close
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </v-sheet>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <!-- Active -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <template v-slot:default="{ open }">
                    <v-row no-gutters>
                      <v-col cols="4"> Active </v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0"></span>
                          <span v-else key="1"></span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content style="padding-right: 0px">
                  <v-card elevation="16">
                    <v-sheet
                      id="scrolling-techniques-3"
                      class="overflow-y-auto"
                      max-height="70vh"
                    >
                      <v-data-table
                        :headers="headers"
                        :items="activeOrphans"
                        item-key="id"
                        :search="activeSearch"
                        append-icon="mdi-magnify"
                        :custom-filter="activeSearchFilter"
                        multi-sort
                        class="elevation-1"
                      >
                        <template v-slot:top>
                          <v-row style="margin: 0px">
                            <!-- Filter/Search Selection -->
                            <!-- TODO: # add tooltip maybe -->
                            <v-col
                              sm="5"
                              offset="0"
                              offset-sm="0"
                              offset-md="0"
                              class="mt-4 mt-sm-0"
                            >
                              <v-responsive
                                min-width="300"
                                max-width="300"
                                class="mx-xs-auto ml-sm-auto mt-sm-2"
                              >
                                <v-select
                                  v-model="activeFilterValue"
                                  hint="select field/s to filter explicity"
                                  :items="activeFilterItems"
                                  :menu-props="{ bottom: true, offsetY: true }"
                                  solo
                                  outlined
                                  dense
                                  persistent-hint
                                  multiple
                                  placeholder="Filter By"
                                >
                                  <template v-slot:selection="{ item, index }">
                                    <v-chip
                                      color="primary"
                                      dark
                                      label
                                      close
                                      close-icon="mdi-close-outline"
                                      @click:close="removeSelectedActive(item)"
                                      v-if="index === 0"
                                    >
                                      <span>{{ item }}</span>
                                    </v-chip>
                                    <span
                                      v-if="index === 1"
                                      class="grey--text caption"
                                    >
                                      (+{{ activeFilterValue.length - 1 }}
                                      others)
                                    </span>
                                  </template>
                                </v-select>
                              </v-responsive>
                            </v-col>
                            <!-- Search Input -->
                            <!-- TODO: # add search icon and close icon -->
                            <v-col
                              sm="7"
                              md="4"
                              offset="1"
                              offset-sm="3"
                              offset-md="1"
                              offset-lg="0"
                            >
                              <v-responsive
                                max-width="300"
                                class="ml-sm-3 mt-sm-4"
                              >
                                <v-text-field
                                  v-model="activeSearch"
                                  placeholder="Search"
                                  dense
                                  flat
                                  clearable
                                  append-icon="mdi-filter-minus"
                                >
                                  <template v-slot:prepend> </template>
                                </v-text-field>
                              </v-responsive>
                            </v-col>
                          </v-row>
                        </template>
                        <!-- edit dialog pop-up for Full Name column -->
                        <!-- TODO: impliment this functionality for all the other columns if needed -->
                        <template v-slot:item.fullName="props">
                          <!-- "large" for the buttons, "persistent" for blocking closing of edit-dialog when clicked outside -->
                          <v-edit-dialog
                            :return-value.sync="props.item.fullName"
                            large
                            persistent
                            cancel-text="Cancel"
                            save-text="Save"
                            @save="save"
                            @cancel="cancel"
                            @open="open"
                            @close="close"
                          >
                            {{ props.item.fullName }}
                            <template v-slot:input>
                              <v-text-field
                                v-model="props.item.fullName"
                                :rules="[max25chars]"
                                label="Edit"
                                single-line
                                counter
                                autofocus
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </template>
                        <!-- edit dialog pop-up for Sponsorship Status column -->
                        <template v-slot:item.sponsorshipStatus="props">
                          <v-edit-dialog
                            :return-value.sync="props.item.sponsorshipStatus"
                            large
                            persistent
                            cancel-text="Cancel"
                            save-text="Save"
                            @save="save"
                            @cancel="cancel"
                            @open="open"
                            @close="close"
                          >
                            {{ props.item.sponsorshipStatus }}
                            <template v-slot:input>
                              <v-text-field
                                v-model="props.item.sponsorshipStatus"
                                :rules="[max25chars]"
                                label="Edit"
                                single-line
                                counter
                                autofocus
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </template>
                        <template v-slot:item.fullName="{ item }">
                          {{ fullName(item) }}
                        </template>
                        <template v-slot:item.age="{ item }">
                          {{ calcAge(item) }}
                        </template>
                        <template v-slot:item.sponsorshipStatus="{ item }">
                          {{ calcSponsorshipStatus(item) }}
                        </template>
                        <template v-slot:item.sponsoredDate="{ item }">
                          {{ calcSponsoredDate(item) }}
                        </template>
                        <template v-slot:item.details="{ item }">
                          <orphan-detail :details="item" user="coordinator" />
                        </template>
                      </v-data-table>
                      <!-- becomes visble when full name is edited -->
                      <!-- TODO: # Impliment a loding functionality -->
                      <!--       # maybe server side validation also -->
                      <v-snackbar
                        v-model="snack"
                        :timeout="3000"
                        :color="snackColor"
                      >
                        {{ snackText }}

                        <template v-slot:action="{ attrs }">
                          <v-btn v-bind="attrs" text @click="snack = false">
                            Close
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </v-sheet>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <!-- Graduated -->
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <template v-slot:default="{ open }">
                    <v-row no-gutters>
                      <v-col cols="4"> Graduated </v-col>
                      <v-col cols="8" class="text--secondary">
                        <v-fade-transition leave-absolute>
                          <span v-if="open" key="0"></span>
                          <span v-else key="1"></span>
                        </v-fade-transition>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card elevation="16">
                    <v-sheet
                      id="scrolling-techniques-3"
                      class="overflow-y-auto"
                      max-height="56vh"
                    >
                      <v-data-table
                        :headers="headers"
                        :items="graduatedOrphans"
                        item-key="id"
                        :search="graduatedSearch"
                        append-icon="mdi-magnify"
                        :custom-filter="graduatedSearchFilter"
                        multi-sort
                        class="elevation-1"
                      >
                        <template v-slot:top>
                          <v-row style="margin: 0px">
                            <!-- Filter/Search Selection -->
                            <!-- TODO: # add close icon and function to remove from selection -->
                            <!--       # add tooltip maybe -->
                            <v-col
                              sm="5"
                              offset="0"
                              offset-sm="0"
                              offset-md="0"
                              class="mt-4 mt-sm-0"
                            >
                              <v-responsive
                                min-width="300"
                                max-width="300"
                                class="mx-xs-auto ml-sm-auto mt-sm-2"
                              >
                                <v-select
                                  v-model="graduatedFilterValue"
                                  hint="select field/s to filter explicity"
                                  :items="graduatedFilterItems"
                                  :menu-props="{ bottom: true, offsetY: true }"
                                  solo
                                  outlined
                                  dense
                                  persistent-hint
                                  multiple
                                  placeholder="Filter By"
                                >
                                  <template v-slot:selection="{ item, index }">
                                    <v-chip
                                      color="primary"
                                      dark
                                      label
                                      close
                                      close-icon="mdi-close-outline"
                                      @click:close="
                                        removeSelectedGraduated(item)
                                      "
                                      v-if="index === 0"
                                    >
                                      <span>{{ item }}</span>
                                    </v-chip>
                                    <span
                                      v-if="index === 1"
                                      class="grey--text caption"
                                    >
                                      (+{{ graduatedFilterValue.length - 1 }}
                                      others)
                                    </span>
                                  </template>
                                </v-select>
                              </v-responsive>
                            </v-col>
                            <!-- Search Input -->
                            <!-- TODO: # add search icon and close icon -->
                            <v-col
                              sm="7"
                              md="4"
                              offset="1"
                              offset-sm="3"
                              offset-md="1"
                              offset-lg="0"
                            >
                              <v-responsive
                                max-width="300"
                                class="ml-sm-3 mt-sm-4"
                              >
                                <v-text-field
                                  v-model="graduatedSearch"
                                  placeholder="Search"
                                  dense
                                  flat
                                  clearable
                                  append-icon="mdi-filter-minus"
                                >
                                  <template v-slot:prepend> </template>
                                </v-text-field>
                              </v-responsive>
                            </v-col>
                          </v-row>
                        </template>
                        <!-- edit dialog pop-up for Full Name column -->
                        <!-- TODO: impliment this functionality for all the other columns if needed -->
                        <template v-slot:item.fullName="props">
                          <!-- "large" for the buttons, "persistent" for blocking closing of edit-dialog when clicked outside -->
                          <v-edit-dialog
                            :return-value.sync="props.item.fullName"
                            large
                            persistent
                            cancel-text="Cancel"
                            save-text="Save"
                            @save="save"
                            @cancel="cancel"
                            @open="open"
                            @close="close"
                          >
                            {{ props.item.fullName }}
                            <template v-slot:input>
                              <v-text-field
                                v-model="props.item.fullName"
                                :rules="[max25chars]"
                                label="Edit"
                                single-line
                                counter
                                autofocus
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </template>
                        <!-- edit dialog pop-up for Sponsorship Status column -->
                        <template v-slot:item.sponsorshipStatus="props">
                          <v-edit-dialog
                            :return-value.sync="props.item.sponsorshipStatus"
                            large
                            persistent
                            cancel-text="Cancel"
                            save-text="Save"
                            @save="save"
                            @cancel="cancel"
                            @open="open"
                            @close="close"
                          >
                            {{ props.item.sponsorshipStatus }}
                            <template v-slot:input>
                              <v-text-field
                                v-model="props.item.sponsorshipStatus"
                                :rules="[max25chars]"
                                label="Edit"
                                single-line
                                counter
                                autofocus
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </template>
                        <template v-slot:item.fullName="{ item }">
                          {{ fullName(item) }}
                        </template>
                        <template v-slot:item.age="{ item }">
                          {{ calcAge(item) }}
                        </template>
                        <template v-slot:item.sponsorshipStatus="{ item }">
                          {{ calcSponsorshipStatus(item) }}
                        </template>
                        <!-- TODO # fix this coz this is done not to change the header array of objects -->
                        <template v-slot:header.sponsoredDate="{ header }">
                          {{ changeSponsoredDateHeaderOfGraduated(header) }}
                        </template>
                        <template v-slot:item.sponsoredDate="{ item }">
                          {{ calcGraduatedDate(item) }}
                        </template>
                        <template v-slot:item.details="{ item }">
                          <orphan-detail :details="item" user="coordinator" />
                        </template>
                      </v-data-table>
                      <!-- becomes visble when full name is edited -->
                      <!-- TODO: # Impliment a loding functionality -->
                      <!--       # maybe server side validation also -->
                      <v-snackbar
                        v-model="snack"
                        :timeout="3000"
                        :color="snackColor"
                      >
                        {{ snackText }}

                        <template v-slot:action="{ attrs }">
                          <v-btn v-bind="attrs" text @click="snack = false">
                            Close
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </v-sheet>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
/* .dino {
  position: -webkit-sticky;
  position: sticky;
  bottom: 1rem;
} */
</style>

<script>
import axios from 'axios';
// import NewOrphanRegistrationModel from "@/components/NewOrphanRegistrationModel.vue";
import OrphanDetail from '@/components/OrphanDetail.vue';

export default {
  // name: "OrphanList",
  props: {
    orphanIds: {
      type: Object,
      required: false,
      default: () => []
    }
  },
  components: {
    // NewOrphanRegistrationModel,
    OrphanDetail
  },

  data() {
    return {
      newSearch: '', // used for newFilter
      processingSearch: '', // used for processingFilter
      pendingSearch: '', // used for pendingFilter
      activeSearch: '', // used for activeFilter
      graduatedSearch: '', // used for graduatedFilter
      drawer: false, // constroles the sidebar
      // test fields *****************
      benched: 0,
      snack: false,
      snackColor: '',
      snackText: '',
      max25chars: (v) => v.length <= 25 || 'Input too long!',
      // *****************************
      orphanDetails: {
        id: 0
        // showOrphanDetail: false,
      },
      detailDialog: false,
      orphanDateOfBirth: null,
      orphanDateOfBirthMenu: false,
      genderOptions: ['Male', 'Female'],
      orphanIndex: 14,
      orphanItems: {
        orphanName: '',
        fatherName: '',
        grandFatherName: '',
        gender: '',
        placeOfBirth: '',
        religion: '',
        spokenLanguages: '',
        psychologicalStatus: '',
        enrollmentStatus: '',
        educationLevel: '',
        educationYearState: '',
        schoolType: '',
        schoolName: '',
        reasonForDropout: '',
        reasonForUnenrolled: '',
        hobbies: '',
        fatherCauseOfDeath: '',
        motherFirstName: '',
        motherMiddleName: '',
        motherLastName: '',
        motherVitalStatus: '',
        motherMaritalStatus: '',
        housingSituation: '',
        otherProperties: ''
      },
      orphanHealthDescription: '',

      // ********************************

      orphanEnrollmentStatusSelect: '',
      orphanEnrollmentStatusOptions: ['Enrolled', 'Drop-Out', 'Un-Enrolled'],
      orphanSchoolTypeSelect: '',
      orphanSchoolTypeOptions: ['Public', 'Private'],
      orphanEducationLevelSelect: '',
      orphanEducationLevelOptions: [
        'Preschool/Religious Education',
        'Kinderguarden',
        'Primary/Elementary',
        'Junior',
        'Highschool',
        'Undergraduate',
        'Postgraduate'
      ],
      orphanEducationYearStateSelect: '',
      orphanEducationYearStateOptions: [],
      orphanSchoolName: '',
      orphanReasonForDropout: '',
      orphanReasonForUnenrolled: '',
      enrollmentStatusDisplay: '',
      orphanHobbies: '',
      educationCertificateDialog: false,

      // ********************************

      fatherDateOfBirthDate: null,
      fatherDateOfBirthMenu: false,
      fatherDateOfDeathDate: null,
      fatherDateOfDeathMenu: false,
      motherFirstName: '',
      motherMiddleName: '',
      motherLastName: '',
      motherDateOfBirthDate: null,
      motherDateOfBirthMenu: false,
      motherVitalStatusSelect: '',
      motherVitalStatusOptions: ['Alive', 'Passed Away'],
      motherMaritalStatusSelect: '',
      motherMaritalStatusOptions: ['Widow', 'Married'],
      orphanHousingSituationSelect: [],
      orphanHousingSituationOptions: [
        'Privately Owned',
        'Rental',
        'With Relative',
        'Dependent'
      ],
      fatherDeathCertificateDialog: false,
      birthCertificateDialog: false,
      // ********************************
      rules: {
        required: (value) => !!value || 'Required.'
      },
      orphanShow: false,
      orphanSelectBtnLable: 'Select Orphans',
      orphanPanel: [],
      selectedOrphans: [],
      showDonorSelectionDialog: false,
      selectedOrphanDonor: '',
      selectedOrphanDonorOptions: [],
      validDonorChoice: false,
      // used in filter selection items
      newFilterItems: [
        'Id',
        'Full Name',
        'Age',
        'Gender',
        'Sponsorship Status',
        'Selected Donor'
      ],
      processingFilterItems: [
        'Id',
        'Full Name',
        'Age',
        'Gender',
        'Sponsorship Status',
        'Selected Donor'
      ],
      pendingFilterItems: [
        'Id',
        'Full Name',
        'Age',
        'Gender',
        'Sponsorship Status',
        'Sponsoring Donor'
      ],
      activeFilterItems: [
        'Id',
        'Full Name',
        'Age',
        'Gender',
        'Sponsorship Status',
        'Sponsored Date'
      ],
      graduatedFilterItems: [
        'Id',
        'Full Name',
        'Age',
        'Gender',
        'Sponsorship Status',
        'Graduated Date'
      ],
      newFilterValue: [],
      processingFilterValue: [],
      pendingFilterValue: [],
      activeFilterValue: [],
      graduatedFilterValue: [],
      // used for filter selection
      // table headers if that wasn't clear enough LOL
      headers: [
        { text: 'Id', value: 'id' },
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
          text: 'Sponsorship Status',
          value: 'sponsorshipStatus'
        },
        { text: 'Sponsored Date', value: 'sponsoredDate' },
        {
          text: 'Details',
          value: 'details',
          sortable: false
        }
      ],
      // table rows/items
      orphans: [],
      newOrphans: [],
      processingOrphans: [],
      pendingOrphans: [],
      activeOrphans: [],
      graduatedOrphans: []
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    // temporary filter for the notification panel
    items() {
      return Array.from({ length: this.length }, (k, v) => v + 1); // I don't know what this is doing exactly
    },
    length() {
      return 7000;
    }
    // used in new orphan dialog
  },
  watch: {
    orphans() {
      this.newOrphans = this.orphans.filter((orphan) => {
        return (
          orphan.sponsorshipStatuses[
            orphan.sponsorshipStatuses.length - 1
          ].status.toLowerCase() === 'new'
        );
      });
      this.processingOrphans = this.orphans.filter((orphan) => {
        return (
          orphan.sponsorshipStatuses[
            orphan.sponsorshipStatuses.length - 1
          ].status.toLowerCase() === 'processing'
        );
      });
      this.pendingOrphans = this.orphans.filter((orphan) => {
        return (
          orphan.sponsorshipStatuses[
            orphan.sponsorshipStatuses.length - 1
          ].status.toLowerCase() === 'pending'
        );
      });
      this.activeOrphans = this.orphans.filter((orphan) => {
        return (
          orphan.sponsorshipStatuses[
            orphan.sponsorshipStatuses.length - 1
          ].status.toLowerCase() === 'active'
        );
      });
      this.graduatedOrphans = this.orphans.filter((orphan) => {
        return (
          orphan.sponsorshipStatuses[
            orphan.sponsorshipStatuses.length - 1
          ].status.toLowerCase() === 'graduated'
        );
      });
    },
    // ***************************************
    // set the Grade/Year based on Education Level
    orphanEducationLevelSelect() {
      if (this.orphanEducationLevelSelect === 'Preschool/Religious Education') {
        this.orphanEducationYearStateOptions = ['first', 'second', 'third'];
      } else if (this.orphanEducationLevelSelect === 'Kinderguarden') {
        this.orphanEducationYearStateOptions = [
          'Preparatory',
          'Nursery',
          'LKG',
          'UKG'
        ];
      } else if (this.orphanEducationLevelSelect === 'Primary/Elementary') {
        this.orphanEducationYearStateOptions = [1, 2, 3, 4, 5, 6];
      } else if (this.orphanEducationLevelSelect === 'Junior') {
        this.orphanEducationYearStateOptions = [7, 8];
      } else if (this.orphanEducationLevelSelect === 'Highschool') {
        this.orphanEducationYearStateOptions = [9, 10, 11, 12];
      } else if (
        this.orphanEducationLevelSelect === 'Undergraduate' ||
        this.orphanEducationLevelSelect === 'Postgraduate'
      ) {
        this.orphanEducationYearStateOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      }
    }
    // ***************************************
  },
  methods: {
    initialize() {
      axios
        .post('/graphql/', {
          query: `query {
                    allOrphans {
                      id
                      created_at
                      firstName
                      father {
                        id
                        firstName
                        lastName
                        dateOfDeath
                        dateOfBirth
                        causeOfDeath
                        deathCertificateUrl
                      }
                      gender
                      dateOfBirth
                      placeOfBirth
                      religion
                      spokenLanguages
                      accountNumber
                      gradeAgeMismatchReason
                      educationalRecords {
                        id
                        enrollmentStatus
                        level
                        year
                        schoolName
                        typeOfSchool
                        reason
                        yearDivision
                        quarter
                        semester
                        numberOfSubjects
                        totalMark
                        average
                        rank
                        semesterGPA
                        cumulativeGPA
                        reportCardUrl
                      }
                      hobbies
                      house_property {
                        id
                        housingSituation
                        otherProperty
                      }
                      sponsorshipStatuses {
                        id
                        status
                        date
                      }
                      guardian {
                        id
                        firstName
                        middleName
                        lastName
                        gender
                        email
                        mobileNumber
                        nationality
                        telephoneNumber
                        dateOfBirth
                        relationToOrphan
                        idCardUrl
                        confirmationLetterUrl
                        legalConfirmationLetterUrl
                      }
                      mother {
                        id
                        firstName
                        middleName
                        lastName
                        dateOfBirth
                        dateOfDeath
                        causeOfDeath
                        vitalStatus
                        maritalStatus
                        mobileNumber
                      }
                      sponsorshipStatuses {
                        status
                        date
                      }
                      donors {
                        id
                        nameInitials
                      }
                      village {
                        id
                        name
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
                    }
                  }`
        })
        .then((res) => (this.orphans = res.data.data.allOrphans))
        .catch((err) => console.warn(err));

      // if (this.orphanIds !== null) {
      //   for (const id of this.orphanIds.ids) {
      //     axios
      //       .post("/graphql/", {
      //         query: `query orphan($id: ID!) {
      //                   orphan(id: $id) {
      //                     id
      //                     created_at
      //                     firstName
      //                     father {
      //                       id
      //                       firstName
      //                       lastName
      //                       dateOfDeath
      //                       dateOfBirth
      //                       causeOfDeath
      //                       deathCertificateUrl
      //                     }
      //                     gender
      //                     dateOfBirth
      //                     placeOfBirth
      //                     religion
      //                     spokenLanguages
      //                     accountNumber
      //                     gradeAgeMismatchReason
      //                     psychologicalStatus
      //                     healthDescription
      //                     education {
      //                       id
      //                       enrollmentStatus
      //                       level
      //                       year
      //                       schoolName
      //                       typeOfSchool
      //                       reason
      //                       educationalRecords {
      //                         yearDivision
      //                         quarter
      //                         semester
      //                         numberOfSubjects
      //                         totalMark
      //                         average
      //                         semesterGPA
      //                         cumulativeGPA
      //                         reportCardUrl
      //                       }
      //                     }
      //                     hobbies
      //                     house_property {
      //                       id
      //                       housingSituation
      //                       otherProperty
      //                     }
      //                     sponsorshipStatuses {
      //                       id
      //                       status
      //                       date
      //                     }
      //                     guardian {
      //                       id
      //                       firstName
      //                       middleName
      //                       lastName
      //                       gender
      //                       email
      //                       mobileNumber
      //                       nationality
      //                       telephoneNumber
      //                       dateOfBirth
      //                       relationToOrphan
      //                       iDCardUrl
      //                       confirmationLetterUrl
      //                       legalConfirmationLetterUrl
      //                     }
      //                     mother {
      //                       id
      //                       firstName
      //                       middleName
      //                       lastName
      //                       dateOfBirth
      //                       dateOfDeath
      //                       causeOfDeath
      //                       vitalStatus
      //                       maritalStatus
      //                       mobileNumber
      //                     }
      //                     sponsorshipStatuses {
      //                       status
      //                       date
      //                     }
      //                     donor {
      //                       id
      //                       nameInitials
      //                     }
      //                     village {
      //                       id
      //                       name
      //                     }
      //                     socialWorker {
      //                       id
      //                       firstName
      //                       middleName
      //                       lastName
      //                       gender
      //                       dateOfBirth
      //                       mobileNumber
      //                     }
      //                   }
      //                 }`,
      //         variables: {
      //           id: id,
      //         },
      //       })
      //       .then((res) => this.orphans.push(res.data.data.orphan))
      //       .catch((err) => console.warn(err));
      //   }
      // }
    },
    updateOrphanList() {
      this.orphans = [];
      this.initialize();
    },
    // custom search function based on selected columns
    activeSearchFilter(value, search, item) {
      return this.searchFilter(value, search, item, this.activeFilterValue);
    },
    newSearchFilter(value, search, item) {
      return this.searchFilter(value, search, item, this.newFilterValue);
    },
    processingSearchFilter(value, search, item) {
      return this.searchFilter(value, search, item, this.processingFilterValue);
    },
    pendingSearchFilter(value, search, item) {
      return this.searchFilter(value, search, item, this.pendingFilterValue);
    },
    graduatedSearchFilter(value, search, item) {
      return this.searchFilter(value, search, item, this.graduatedFilterValue);
    },
    searchFilter(value, search, item, filterValue) {
      if (search.length > 0) {
        if (filterValue.length > 0) {
          for (const filterVal of filterValue) {
            if (filterVal === this.headers[0].text) {
              return item.id.indexOf(search) !== -1;
            } else if (filterVal === this.headers[1].text) {
              return (
                this.fullName(item)
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[2].text) {
              return (
                this.calcAge(item)
                  .toString()
                  .indexOf(search) !== -1
              );
            } else if (filterVal === this.headers[3].text) {
              return (
                item.gender.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[4].text) {
              return (
                this.calcSponsorshipStatus(item)
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[5].text) {
              return this.calcSponsoredDate(item).indexOf(search) !== -1;
            } else if (filterVal === this.changeSponsoredDateHeaderOfNew()) {
              return (
                this.displayOrphanRegistrationDate(item).indexOf(search) !== -1
              );
            } else if (
              filterVal ===
              this.changeSponsoredDateHeaderOfPendingAndProcessing()
            ) {
              return (
                this.displaySponsoringOrphanDonor(item).indexOf(search) !== -1
              );
            } else if (
              filterVal === this.changeSponsoredDateHeaderOfGraduated()
            ) {
              return this.calcGraduatedDate(item).indexOf(search) !== -1;
            } else {
              return -1;
            }
          }
        } else {
          return (
            this.fullName(item) != null &&
            typeof this.fullName(item) === 'string' &&
            this.fullName(item)
              .toString()
              .toLowerCase()
              .indexOf(search) !== -1
          );
        }
      }
    },
    fullName(item) {
      return (
        `${item.firstName.substr(0, 1).toUpperCase()}${item.firstName.substr(
          1
        )}` +
        ` ${item.father.firstName
          .substr(0, 1)
          .toUpperCase()}${item.father.firstName.substr(1)}` +
        ` ${item.father.lastName
          .substr(0, 1)
          .toUpperCase()}${item.father.lastName.substr(1)}`
      );
    },
    calcAge(item) {
      return (
        new Date().getUTCFullYear() -
        new Date(Date.parse(item.dateOfBirth.toString())).getUTCFullYear()
      );
    },
    calcSponsorshipStatus(item) {
      return item.sponsorshipStatuses[item.sponsorshipStatuses.length - 1]
        .status;
    },
    calcSponsoredDate(item) {
      const options = {
        // weekday: "long",
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return new Date(
        Date.parse(
          item.sponsorshipStatuses[
            item.sponsorshipStatuses.length - 1
          ].date.toString()
        )
      ).toLocaleDateString(undefined, options);
    },
    calcGraduatedDate(item) {
      const options = {
        // weekday: "long",
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return new Date(
        Date.parse(
          item.sponsorshipStatuses[
            item.sponsorshipStatuses.length - 1
          ].date.toString()
        )
      ).toLocaleDateString(undefined, options);
    },
    goToCoordinatorTable() {
      this.$emit('onBack', false);
    },
    cancelOrphanChoice() {
      this.orphanShow = false;
      this.orphanPanel = null;
      this.donorChoiceClose();
      this.donorChoiceReset();
    },
    chooseOrphans() {
      if (this.$refs.donorSelect.validate()) {
        this.orphanShow = true;
        this.orphanSelectBtnLable = 'Send Orphans';
        this.orphanPanel = 0;
        this.donorChoiceClose();
      } else {
        // handle err and show some kind of notification
      }
    },
    donorChoiceClose() {
      this.showDonorSelectionDialog = false;
    },
    donorChoiceReset() {
      this.$refs.donorSelect.reset();
    },
    createSponsorshipStatus(orphanId, status) {
      return axios
        .post('/graphql', {
          query: `mutation createSponsorshipStatus(
                  $status: sponsorshipStatus
                  $date: DateTime!
                  $orphanId: ID
                ) {
                  createSponsorshipStatus(status: $status, date: $date, orphanId: $orphanId) {
                    id
                    status
                    date
                    orphan {
                      id
                    }
                  }
                }`,
          variables: {
            status: status,
            date: new Date().toISOString(),
            orphanId: orphanId
          }
        })
        .then((res) => res.data.data.createSponsorshipStatus)
        .catch((err) => console.warn(err));
    },
    async selectOrphans() {
      if (!this.orphanShow || this.orphanPanel === null) {
        this.selectedOrphanDonorOptions = await axios
          .post('/graphql/', {
            query: `query coordinator($id: ID!) {
                      coordinator(id: $id) {
                        donors {
                          id
                          nameInitials
                        }
                      }
                    }`,
            variables: {
              id: this.$route.params.id
            }
          })
          .then((res) => res.data.data.coordinator)
          .then((coordinator) => coordinator.donors)
          .catch((err) => console.warn(err));
        this.showDonorSelectionDialog = true;
        this.selectedOrphans = [];
      } else {
        this.showDonorSelectionDialog = false;
        this.orphanSelectBtnLable = 'Select Orphans';
        this.orphanPanel = null;

        let donor = this.selectedOrphanDonorOptions.filter(
          (cur) => cur.nameInitials === this.selectedOrphanDonor
        )[0];
        let selectedDonorId = donor.id;
        let selectedOrphanIds = this.selectedOrphans.map((orphan) =>
          parseInt(orphan.id)
        );

        let recievedOrphanIds = await axios
          .post('/graphql/', {
            query: `mutation($id: ID!, $orphans: [ID]) {
                  updateDonor(id: $id, orphans: $orphans) {
                    id
                    nameInitials
                    orphans {
                      id
                    }
                  }
                }`,
            variables: {
              id: selectedDonorId,
              orphans: selectedOrphanIds
            }
          })
          // change sponsoreship status
          .then((res) => res.data.data.updateDonor)
          .then(() => {
            for (const orphanId of selectedOrphanIds) {
              this.createSponsorshipStatus(orphanId, 'processing')
                .then((sponsorshipStatuse) => {
                  console.log('SponsoreStatus:', sponsorshipStatuse);
                })
                .catch((err) => console.warn(err));
            }
          })
          .catch((err) => console.warn(err));
        console.log('recievedOrphanIds', recievedOrphanIds);
        this.selectedOrphans = [];
      }
    },
    changeSponsoredDateHeaderOfNew() {
      return 'Registred Date';
    },
    changeSponsoredDateHeaderOfPendingAndProcessing() {
      return 'Sponsoring Donor';
    },
    changeSponsoredDateHeaderOfGraduated() {
      return 'Graduated Date';
    },
    displayOrphanRegistrationDate(item) {
      const options = {
        // weekday: "long",
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return new Date(
        Date.parse(item.created_at.toString())
      ).toLocaleDateString(undefined, options);
    },
    displaySponsoringOrphanDonor(item) {
      return item.donor ? item.donor.nameInitials : '';
    },
    // new showDetal
    showDetail(item) {
      this.orphanDetails.id = item.id;
      this.orphanDetails.showOrphanDetail = true;
      console.log('orphanDetals:', this.orphanDetails);
    },
    // *********************************
    orphanDateOfBirthSave(date) {
      // console.log(this.$refs.menu);
      this.$refs.menu.save(date);
    },
    // **********************************
    // combobox methods
    removeOrphanHousingSituationSelect(attrs, item) {
      this.orphanHousingSituationSelect.splice(
        this.orphanHousingSituationSelect.indexOf(item),
        1
      );
      console.log(
        'orphanHousingSituationSelect',
        this.orphanHousingSituationSelect
      );
      console.log('attrs', attrs);
      this.orphanHousingSituationSelect = [
        ...this.orphanHousingSituationSelect
      ];
    },
    // **********************************
    // Portrait Photo
    togglePortraitPhotoDialog() {
      this.portraitPhotoDialog = !this.portraitPhotoDialog;
    },
    // Education Certificate
    toggleEducationCertificateDialog() {
      this.educationCertificateDialog = !this.educationCertificateDialog;
    },
    // Father Death Certificate
    toggleFatherDeathCertificateDialog() {
      this.fatherDeathCertificateDialog = !this.fatherDeathCertificateDialog;
    },
    // Birth Certificate
    toggleBirthCertificateDialog() {
      this.birthCertificateDialog = !this.birthCertificateDialog;
    },
    removeSelectedNew(item) {
      this.newFilterValue.splice(this.newFilterValue.indexOf(item), 1);
      this.newFilterValue = [...this.newFilterValue];
    },
    removeSelectedProcessing(item) {
      this.processingFilterValue.splice(
        this.processingFilterValue.indexOf(item),
        1
      );
      this.processingFilterValue = [...this.processingFilterValue];
    },
    removeSelectedPending(item) {
      this.pendingFilterValue.splice(this.pendingFilterValue.indexOf(item), 1);
      this.pendingFilterValue = [...this.pendingFilterValue];
    },
    removeSelectedActive(item) {
      this.activeFilterValue.splice(this.activeFilterValue.indexOf(item), 1);
      this.activeFilterValue = [...this.activeFilterValue];
    },
    removeSelectedGraduated(item) {
      this.graduatedFilterValue.splice(
        this.graduatedFilterValue.indexOf(item),
        1
      );
      this.graduatedFilterValue = [...this.graduatedFilterValue];
    },

    // **********************************
    sendTest() {
      // changes the iso 8619 date format to milliseconds since jan 1970
      // let dateOfBirthMilli = Date.parse(this.orphans[0].dateOfBirth.toString());
      // changes the millisecond to date object
      // let dateOfBirth = new Date(dateOfBirthMilli);
      // gets the current date
      // let current = new Date();
      // subtracts current date and that one
      // console.log(current.getUTCFullYear() - dateOfBirth.getUTCFullYear());

      console.log('orphans', this.orphans);
    }
  }
};
</script>
