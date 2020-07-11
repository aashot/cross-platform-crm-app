<template>
  <f7-popup class="update-issue">
    <f7-view>
      <f7-page>
        <f7-navbar title="Редактировать задачу">
          <f7-nav-right>
            <f7-link popup-close>Закрыть</f7-link>
          </f7-nav-right>
        </f7-navbar>
        <f7-block>
          <form>
            <f7-list>
              <f7-list-input
                label="Тема"
                type="text"
                :value="subject"
                @input="subject = $event.target.value"
                placeholder="Тема задачи"
              ></f7-list-input>
              <f7-list-input
                label="Описание"
                type="textarea"
                :value="description"
                @input="description = $event.target.value"
                placeholder="Описание задачи"
              ></f7-list-input>
              <f7-list-input
                label="Комментарий"
                type="textarea"
                :value="comment"
                @input="comment = $event.target.value"
                placeholder="Описание задачи"
              ></f7-list-input>
              <f7-list-item title="Приоритет" smart-select routableModals="false">
                <select v-model="priority" name="priority">
                  <option
                    v-for="item in priorities"
                    :key="item.id"
                    v-bind:value="item.id"
                  >{{item.name}}</option>
                </select>
              </f7-list-item>
              <f7-list-item>
                <div class="custom-file">
                  <input
                    multiple="multiple"
                    @change="prepareFiles"
                    id="file-1"
                    class="button"
                    type="file"
                  />
                  <label for="file-1" class="popup-label">
                    <i class="f7-icons">cloud_upload</i>
                  </label>
                  <div class="custom-file__blocks" v-if="tempImgPaths.length">
                    <div
                      class="custom-file__img"
                      v-for="(img, imgIndex) of tempImgPaths"
                      :style="`background-image: url(${img.src})`"
                      :key="imgIndex"
                      @taphold="selectFileToDelete(img)"
                    ></div>
                  </div>
                </div>

                <f7-actions ref="tapHoldActions">
                  <f7-actions-group>
                    <f7-actions-label>Удалить файл?</f7-actions-label>
                    <f7-actions-button @click="deleteFile" bold>Да</f7-actions-button>
                    <f7-actions-button color="red">Отмента</f7-actions-button>
                  </f7-actions-group>
                </f7-actions>
              </f7-list-item>
            </f7-list>
            <f7-button @click="updateIssue" class="col-50 button button-fill color-purple">Сохранить</f7-button>
          </form>
        </f7-block>
      </f7-page>
    </f7-view>
  </f7-popup>
</template>

<script>
import axios from "axios";

export default {
  name: "update-issue",
  props: {
    issue: {
      type: Object
    },

    projectKey: {
      type: String
    },

    issueFiles: {
      type: Array
    },

    issueTempImgPaths: {
      type: Array
    }
  },

  data() {
    return {
      project: this.issue.project.id,
      tracker: this.issue.tracker.id,
      subject: this.issue.subject,
      description: this.issue.description,
      status: this.issue.status.id,
      priority: this.issue.priority.id,
      comment: null,
      files: [],
      tempImgPaths: [],
      uploads: [],
      deleteTmpImg: false,
      selectedTmpImg: null
    };
  },

  computed: {
    priorities() {
      return this.$store.getters.getPriorities;
    }
  },

  watch: {
    issueFiles: function(value) {
      this.files = JSON.parse(JSON.stringify(value));
    },

    issueTempImgPaths: function(value) {
      this.tempImgPaths = JSON.parse(JSON.stringify(value));
    }
  },

  created() {
    this.$root.log = function log() {
      for (let i = 0; i < arguments.length; i += 1) {
        if (typeof arguments[i] === "object") {
          try {
            arguments[i] = JSON.parse(JSON.stringify(arguments[i]));
          } catch (e) {
            console.error(e);
          }
        }
      }
      console.log(...arguments);
    };
  },

  methods: {
    /**
     * On input change handler
     */
    prepareFiles(event) {
      const files = event.target.files;
      const itemKey = Math.round(Math.random() * 500);

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
              this.tempImgPaths.push({ src: e.target.result, key: itemKey });
              console.log("the file is loaded!!!");
              console.log(e);
            };

            fileReader.readAsDataURL(item);
          }

          this.files.push({ file: item, key: itemKey });
        }
      });
    },

    deleteFile() {
      this.tempImgPaths = this.tempImgPaths.filter(
        img => img.src !== this.selectedTmpImg.src
      );

      this.files = this.files.filter(
        file => file.key !== this.selectedTmpImg.src
      );

      this.$forceUpdate();
    },

    /**
     * Ask to delete file on tapHold
     */
    selectFileToDelete(img) {
      this.selectedTmpImg = img;
      this.$refs.tapHoldActions.open();
    },

    /**
     * Updating issue data
     */
    async updateIssue() {
      let postUrl = `https://vioproject.com/issues/${this.issue.id}.json`,
        uploads,
        dataObj = {
          issue: {
            project_id: this.project,
            tracker_id: this.tracker,
            subject: this.subject,
            description: this.description,
            status_id: this.status,
            priority_id: this.priority,
            notes: this.comment,
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
          "X-Redmine-API-Key": `${this.projectKey}`
        };

      this.$f7.preloader.show();

      await this.sendFiles()
        .then(resp => {
          console.log("resp: ====", this.uploads);

          console.log(this.$root.log(resp));

          this.uploads.forEach(file => {
            console.log("file: =============", file);
            dataObj.issue.uploads.push({ token: file.token + "" });
          });

          console.log("resp", this.uploads.length);
          console.log("resp[0]", this.uploads[0]);
          console.log("resp[1]", this.uploads[1]);

          for (let i = 0; i < this.uploads.length; i++) {
            console.log(i);
          }
        })
        .catch(err => console.log(err));

      console.log("dataObj", dataObj);

      await fetch(postUrl, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(dataObj)
      });

      this.$f7.preloader.hide();

      this.$f7.popup.close(".update-issue");
    },

    /**
     * Send file and get token
     * return
     */
    async sendFiles() {
      let uploads = [];

      return await this.files.forEach(async file => {
        let fileUrl = `https://vioproject.com/uploads.json?filename=${file.name}`;
        await fetch(fileUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "X-Redmine-API-Key": `${this.projectKey}`
          },
          body: file
        })
          .then(async resp => {
            await resp
              .json()
              .then(response => {
                uploads.push(response.upload);
                this.uploads.push(response.upload);
                this.$forceUpdate();
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });
      });
    }
  }
};
</script>