<template>
  <v-app>
    <v-data-table
      :headers="headers"
      :items="ruangs"
      :sort-by.sync="nama"
      :search="searc"
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
                <v-card-title>
                  <span class="headline">{{formTitle}}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.nama"
                          label="Nama Ruang">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-textarea 
                          v-model="editedItem.keterangan" label="Keterangan">
                        </v-textarea>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field 
                          v-model="editedItem.kapasitas"
                          label="Kapasitas">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
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
                  <v-btn color="blue darken-1" text @click="save()">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
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
    let uri = 'http://localhost:3000/prodi';
    this.axios.get(uri)
    .then((res) => {
      console.log(res);
    });
  },
  data(){
    return{
      nama:'nama',
      search:'',
      dialog:false,
      ruangs:[],
      headers:[
        {text:'Nama', value:'nama'},
        {text:'Keterangan', value:'keterangan'},
        {text:'Kapasitas', value:'kapasitas'},
        {text:'Status', value:'text_status'},
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
            }
          }).catch((err) => {
            alert(err);
          });
      }
      this.close();
    },
    editItem(item){
      this.editedIndex = this.ruangs.indexOf(item);
      this.editedItwm = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item){
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
</script>