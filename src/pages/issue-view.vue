<template>
  <f7-page
    name="issue-view"
    ptr
    :ptr-mousewheel="true"
    @ptr:refresh="refreshPage"
    class="issue-view"
  >
    <f7-navbar
      back-link="Back"
      :class="{'skeleton-text skeleton-effect-blink': !info || refreshing}"
    >
      <f7-nav-left>
        <template v-if="!info || refreshing">Loremm AAAAAAAAAAAA</template>
        <template v-else>{{ info.project.name }} - {{ `#${info.id}` }}</template>
        <f7-icon
          v-if="info && !refreshing"
          :f7="info.status.name | statusIcon"
          size="22px"
          class="ml-3"
        ></f7-icon>
      </f7-nav-left>
      <f7-nav-right>
        <f7-icon
          f7="menu"
          size="34px"
          class="issue-more-actions"
          @click.native="triggerIssueActions"
        ></f7-icon>

        <f7-actions ref="issueActions">
          <f7-actions-group>
            <f7-actions-button bold>
              <f7-link class="button" popup-open=".update-issue">
                Обновить
                <f7-icon f7="square_pencil" class="issue-action-icon" size="25px"></f7-icon>
              </f7-link>
            </f7-actions-button>
            <f7-actions-button color="red">
              <f7-link class="button">
                Закрыть
                <f7-icon f7="multiply" class="issue-action-icon" size="25px"></f7-icon>
              </f7-link>
            </f7-actions-button>
          </f7-actions-group>
        </f7-actions>
      </f7-nav-right>
    </f7-navbar>

    <f7-block>
      <f7-swiper v-if="info" :params="{speed:500, slidesPerView: 1.25}">
        <f7-swiper-slide v-for="(actionParams, actionIndex) of issueAcitons" :key="actionIndex">
          <action-card
            :params="actionParams"
            @action="updateIssueStatus(actionParams.changeStatusTo)"
          />
        </f7-swiper-slide>
      </f7-swiper>
    </f7-block>

    <f7-block>
      <f7-card>
        <f7-card-header>
          <div v-if="!info || refreshing" class="skeleton-text skeleton-effect-blink">Lorem</div>
          <strong v-else>{{`${info.subject}`}}</strong>
        </f7-card-header>
        <f7-card-content>
          <f7-list>
            <f7-list-item divider>Описание</f7-list-item>
            <f7-list-item>
              <div
                class="text-descr skeleton-text skeleton-effect-blink"
                v-if="!info || refreshing"
              >Lorem ipsum dolor sit amet consectetur.</div>
              <div class="text-descr" v-else>
                <span v-if="info.description" v-html="textFormater(info.description)"></span>
                <span v-else>без описания</span>
              </div>
            </f7-list-item>
          </f7-list>
          <f7-list>
            <f7-list-item class="issue-actions">
              <f7-gauge
                type="circle"
                class="issue-done-ratio"
                :class="{'skeleton-text skeleton-effect-blink': !info}"
                :value="guageValue / 100"
                :value-text="guageValue"
                :value-font-size="15"
                value-text-color="var(--f7-button-text-color)"
                :size="60"
                :border-width="2"
                border-color="var(--f7-button-text-color)"
              ></f7-gauge>
            </f7-list-item>
          </f7-list>
        </f7-card-content>
      </f7-card>
    </f7-block>
    <f7-block v-if="info && info.journals && info.journals.length">
      <f7-block-title>Комментарии</f7-block-title>
      <f7-messages :scroll-messages="false">
        <f7-message
          v-for="(message, index) of info.journals"
          :key="index"
          type="received"
          :name="message.user.name"
          :first="true"
          :tail="true"
        >
          <span v-if="message.notes" v-html="textFormater(message.notes)"></span>
        </f7-message>
      </f7-messages>
    </f7-block>

    <f7-block>
      <div class="issue-attachments__header">
        <div>Вложения</div>
        <div class="custom-file">
          <input multiple="multiple" @change="uploadFiles" id="file-2" class="button" type="file" />
          <label for="file-2">
            <f7-icon f7="cloud_upload" size="34px"></f7-icon>
          </label>
          <div class="custom-file__blocks"></div>
        </div>
      </div>
      <div class="issue-attachments" v-if="info && info.attachments.length">
        <div class="custom-file__blocks">
          <div
            :class="{ 
              'custom-file__file': !file.content_type.match(/image/g),
              'custom-file__img': file.content_type.match(/image/g)
            }"
            v-for="(file, fileIndex) of info.attachments"
            :style="
              file.content_type.match(/image/g) ?
              `background-image: url(${file.imgPath})` :
              ''
            "
            :key="fileIndex"
            @click="downloadFile(file)"
          >
            <span v-if="!file.content_type.match(/image/g)">{{ file.filename.split('.')[1] }}</span>
          </div>
        </div>
      </div>
    </f7-block>

    <!-- Popup component -->
    <UpdateIssue v-if="info" :issue="info" :projectKey="apiKey"></UpdateIssue>
  </f7-page>
</template>

<script>
import axios from "axios";
import textile from "textile-js";
import { mapActions, mapState } from "vuex";
import actionsByStatus from "../helpers/actionsByStatus.js";
import UpdateIssue from "@/components/popup/UpdateIssue";
import ActionCard from "../components/ActionCard.vue";
import $$ from "dom7";

export default {
  name: "issue-view",

  components: {
    UpdateIssue,
    ActionCard
  },

  data() {
    return {
      files: [],
      uploads: [],
      refreshing: false,
      guageValue: "0"
    };
  },

  computed: {
    ...mapState({
      apiKey: state => state.key,
      info: state => state.issue,
      isCordovaOn: state => state.isCordovaOn
    }),

    issueAcitons() {
      return actionsByStatus(this.info.status.name);
    }
  },

  watch: {
    refreshing(value) {
      if (!value) {
        this.setGuageValue();
      }
    }
  },

  created() {
    this.refreshPage(this.$f7.ptr.done);

    this.setGuageValue();
  },

  methods: {
    ...mapActions(["getIssueInfo", "updateIssue"]),

    updateIssueStatus(status) {
      this.$f7.preloader.show();
      this.updateIssue({
        issue: {
          status_id: status
        }
      })
        .then(() => {
          console.log("Issue status updated!!!");
          const notificationMessage = this.$f7.notification.create({
            title: "Статус задачи успешно обновлен!",
            closeButton: true,
            closeTimeout: 1000
          });

          notificationMessage.open();
          this.$f7.preloader.hide();
        })
        .catch(() => {
          const notificationMessage = this.$f7.notification.create({
            title: "Не удалось обновить статус задачи!",
            closeButton: true,
            closeTimeout: 1000
          });

          notificationMessage.open();
          this.$f7.preloader.hide();
        })
        .finally(() => {
          this.$f7.preloader.hide();
        })
    },

    triggerIssueActions() {
      console.log(this.$refs.issueActions);
      this.$refs.issueActions.open();
    },

    setGuageValue() {
      this.guageValue = "0";
      setTimeout(() => {
        if (this.info && this.info.done_ratio) {
          this.guageValue = this.info.done_ratio;
        }
      }, 350);
    },

    refreshPage(done) {
      this.refreshing = true;
      this.getIssueInfo(this.$f7route.params.id).finally(() => {
        this.refreshing = false;
        done();
      });
    },

    textFormater(text) {
      if (!text.indexOf("!")) {
        return "- Изображение";
      } else {
        return textile(text);
      }
    },

    /**
     * Cordova function
     */
    downloadFile({ content_url, content_type, filename }) {
      if (window.cordova) {
        this.$f7.preloader.show();
        const fileTransfer = new FileTransfer();
        // You may need to encode the URL before downloading just use encodeURI(`${content_url}?key=${this.apiKey`)
        const uri = `${content_url}?key=${this.apiKey}`;
        const fileURL = `cdvfile://localhost/temporary/path/to/${filename}`;

        fileTransfer.download(
          uri,
          fileURL,
          entry => {
            console.log("download complete: ", entry);
            this.openFile(entry.nativeURL, content_type);
          },
          error => {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code" + error.code);

            const notificationMessage = this.$f7.notification.create({
              title: "Ошибка!",
              subtitle: "Произошла ошибка при загрузке файла",
              closeButton: true,
              closeTimeout: 2000
            });

            this.$f7.preloader.hide();
            notificationMessage.open();
          },
          false
        );
      }
    },

    /**
     * Cordova function
     */
    openFile(content_url, contentType) {
      if (window.cordova) {
        cordova.plugins.fileOpener2.open(content_url, contentType, {
          success(event) {
            console.log("successEvent:", event);
            this.$f7.preloader.hide();
          },
          error(event) {
            console.error("errorEvent:", event);
            const notificationMessage = this.$f7.notification.create({
              title: "Ошибка!",
              subtitle: "Произошла ошибка при открытии файла",
              closeButton: true,
              closeTimeout: 2000
            });

            notificationMessage.open();
            this.$f7.preloader.hide();
          }
        });
      }
    },

    uploadFiles(event) {
      const files = event.target.files;

      Object.values(files).forEach(item => {
        let isConsist = false;

        this.files.forEach(file => {
          if (file.name === item.name) {
            isConsist = true;
          }
        });

        if (!isConsist) {
          if (item.type.match("image")) {
            let fileReader = new FileReader();
            fileReader.onload = e => {
              // ...
            };
            fileReader.readAsDataURL(item);
          }

          this.files.push(item);
          this.updateIssueAttachments();
        }
      });
    },

    updateIssueAttachments() {
      let postUrl = `https://vioproject.com/issues/${this.info.id}.json`,
        uploads,
        dataObj = {
          issue: {
            project_id: this.info.id,
            tracker_id: this.info.tracker.id,
            subject: this.info.subject,
            description: this.description,
            status_id: this.info.status.id,
            priority_id: this.info.priority.id,
            uploads: []
          }
        },
        headers = {
          "Content-Type": "application/json",
          Origin: "*",
          Accept: "*",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
          "X-Redmine-API-Key": `${this.apiKey}`
        };

      this.$f7.preloader.show();

      this.sendFiles()
        .then(async resp => {
          this.uploads.forEach(file => {
            console.log("file: =============", file);
            dataObj.issue.uploads.push({ token: file.token + "" });
          });

          console.log("dataObj", dataObj);

          await fetch(postUrl, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(dataObj)
          })
            .then(() => {
              console.log("files uploaded!");
              // console.log(this.);
              this.getIssueInfo(this.$f7route.params.id).then(() => {
                this.$f7.preloader.hide();
              });
            })
            .catch(error => {
              console.error(error);
              this.$f7.preloader.hide();
            });
        })
        .catch(err => console.log(err));
    },

    /**
     * Send file and get token
     * return
     */
    sendFiles() {
      return new Promise((resolve, reject) => {
        let uploads = [];
        this.files.forEach(async file => {
          console.log("sendFiles");
          let fileUrl = `https://vioproject.com/uploads.json?filename=${file.name}`;
          await fetch(fileUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/octet-stream",
              "X-Redmine-API-Key": `${this.apiKey}`
            },
            body: file
          })
            .then(async resp => {
              await resp
                .json()
                .then(response => {
                  uploads.push(response.upload);
                  this.uploads.push(response.upload);
                  resolve();
                })
                .catch(err => {
                  reject();
                  console.log(err);
                });
            })
            .catch(err => {
              reject();
              console.log(err);
            });
        });
      });
    }
  }
};
</script>