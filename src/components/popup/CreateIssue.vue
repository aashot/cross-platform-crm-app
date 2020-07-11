<template>
    <f7-popup class="create-issue">
        <f7-view>
            <f7-page>
                <f7-navbar title="Создать задачу">
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
                            >
                            </f7-list-input>
                            <f7-list-input
                                label="Описание"
                                type="textarea"
                                :value="description"
                                @input="description = $event.target.value"
                                placeholder="Описание задачи"
                            >
                            </f7-list-input>
                            <f7-list-item title="Приоритет" smart-select routableModals="false">
                                <select v-model="priority" name="priority">
                                    <option v-for="item in priorities" :key="item.id" v-bind:value="item.id">{{item.name}}</option>
                                </select>
                            </f7-list-item>
                        </f7-list>
                        <f7-button @click="sendIssue" class="col-50 button button-fill color-purple">Создать задачу</f7-button>
                    </form>
                </f7-block>
            </f7-page>
        </f7-view>
    </f7-popup>
</template>

<script>
import axios from 'axios';

export default {
    props: {
        project: {
            type: Number
        },

        projectKey: {
            type: String
        }
    },

    name: 'create-issue',

    data() {
        return {
            subject: '',
            description: '',
            status: 2, // К исполненю
            priority: 1,
        }
    },

    computed: {
        priorities(){
            return this.$store.getters.getPriorities;
        }
    },

    methods: {
        async sendIssue() {
            let 
                postUrl = `https://vioproject.com/issues.json`,
                dataObj = {
                    issue: {
                        project_id: this.project,
                        subject: this.subject,
                        description: this.description,
                        status_id: this.status,
                        priority_id: this.priority
                    }
                };
            
            this.$f7.preloader.show();

            await fetch(postUrl,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': '*',
                    'Accept' : '*',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                    'X-Redmine-API-Key': `${this.projectKey}`
                },
                // mode: 'no-cors',
                body: JSON.stringify(dataObj)
            })

            this.$f7.preloader.hide();

            this.clearFields();
            this.$$('.item-after').each((index,item) => {
                this.$$(item).text(this.$$(item).parent().find('select').find('option').text());
            })
             this.$f7.popup.close('.create-issue');
        },

        clearFields() {
            this.subject = '';
            this.description = '';
            this.status = 1;
            this.priority = 1;
        }
    }
}
</script>