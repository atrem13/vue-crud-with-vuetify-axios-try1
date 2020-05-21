<template>
  <v-app>
    <v-data-table
      :headers="headers"
      :items="ruangs"
      :sort-by.sync="nama"
      :search="search"
      class="elevation"
    >
      <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Ruang</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            >
            </v-divider>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            >
            </v-text-field>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{on}">
                <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
              </template>
              <v-card>
                <v-form
                  ref="form"
                  v-model="formValidation"
                  lazy-validation
                >
                  <v-card-title>
                    <span class="headline">{{formTitle}}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.nama"
                            label="Nama Ruang"
                            :rules="inputRules.nama"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea 
                            v-model="editedItem.keterangan" 
                            label="Keterangan"
                            :rules="inputRules.keterangan"
                            required
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field 
                            v-model="editedItem.kapasitas"
                            label="Kapasitas"
                            :rules="inputRules.kapasitas"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <!-- <v-select
                            v-model="editedItem.status"
                            :items="statusItem"
                            label="Status"
                          ></v-select> -->
                          <v-switch
                            v-model="editedItem.status"
                            label="Status"
                          ></v-switch>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close()">Close</v-btn>
                    <v-btn color="blue darken-1" :disabled="!formValidation" text @click="save()">Save</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
      </template>
      <template v-slot:item.status="{item}">
        {{(item.status) ? 'Booked' : 'Avaiable'}}
      </template>
      <template v-slot:item.aksi="{item}">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary">Data Empty</v-btn>
      </template>
    </v-data-table>
  </v-app>  
</template>
<script>
export default {
  created(){
    let uri = 'http://localhost:3000/ruang';
    this.axios.get(uri)
    .then((res) => {
      this.ruangs = res.data.data;
    });
  },
  data(){
    return{
      formValidation:true,
      inputRules:{
        nama:[
          v => !!v || 'nama is required'
        ],
        keterangan:[
          v => (v.length) || 'keterangan is required'
        ],
        kapasitas:[
          v => !!v || 'kapasitas is required',
          v => (!isNaN(v)) || 'kapasitas berupa angka'
        ]

      },
      nama:'nama',
      search:'',
      dialog:false,
      ruangs:[],
      headers:[
        {text:'Nama', value:'nama'},
        {text:'Keterangan', value:'keterangan'},
        {text:'Kapasitas', value:'kapasitas'},
        {text:'Status', value:'status'},
        {text:'Aksi', value:'aksi'},
      ],
      editedIndex: -1,
      editedItem:{
        nama:'',
        keterangan:'',
        kapasitas:'',
        status:''
      },
      defaultItem:{
        nama:'',
        keterangan:'',
        kapasitas:'',
        status:''
      },
      statusItem:[
        {
          text:'Booking',
          value:1
        },
        {
          text:'Available',
          value:0
        }
      ]
    }
  },
  computed:{
    formTitle(){
      return this.editedIndex == -1 ? 'New Item' : 'Edit Item';
    },
  },
  watch:{
    dialog(val){
      val || this.close()
    },
  },
  methods:{
    close(){
      this.$refs.form.resetValidation();
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save(){
      if(this.editedIndex > -1){
        let uri = `http://localhost:3000/ruang/${this.editedItem.id}`;
        this.axios.put(uri, this.editedItem)
          .then((res) => {
            if(res.data.data){
              Object.assign(this.ruangs[this.editedIndex], this.editedItem);
              this.close();
            }else{
              alert(res.data.error);
            }
          }).catch((err) => {
            alert(err);
          });
      }else{
        let uri = 'http://localhost:3000/ruang';
        this.axios.post(uri, this.editedItem)
          .then((res) => {
            if(res.data.data){
              this.ruangs.push(res.data.data);
              this.close();
            }
          }).catch((err) => {
            alert(err);
          });
      }
    },
    editItem(item){
      this.editedIndex = this.ruangs.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item){
      let del = confirm('are you sure want to delete this item?');
      if(del){
        let uri = `http://localhost:3000/ruang/${item.id}`;
        this.axios.delete(uri)
          .then((res) => {
            if(res.data.data){
              let index = this.ruangs.indexOf(item);
              this.ruangs.splice(index, 1);
            }else{
              alert(res.data.error);
            }
          }).catch((err) => {
            alert(err);
          });
      }
    }
  }
}
</script>