<template>
  <v-app>
    <v-data-table
      :headers="headers"
      :items="prodis"
      :sort-by.sync="nama"
      class="elevation-1"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Prodi</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
            </template>
            <v-card>
              <v-form
                ref="form"
                v-model="formValidation"
                lazy-validation
              >
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.nama" 
                          label="Nama Prodi"
                          :rules="inputRules.nama"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field 
                          v-model="editedItem.akreditas" 
                          label="Akreditas Prodi"
                          :rules="inputRules.akreditas"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
                  <v-btn color="blue darken-1" :disabled="!formValidation" text @click="save()">Save</v-btn>
                </v-card-actions>
              </v-form>

            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.aksi="{ item }">
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
    let uri = "http://localhost:3000/prodi";
    this.axios.get(uri)
      .then((res) => {
        // console.log(res);
        this.prodis = res.data.data;
      }).catch((err) => {
          console.log(err);
      })
  },
  data(){
    return{
      formValidation:true,
      inputRules:{
        nama:[
          v => !!v || 'nama is required'
        ],
        akreditas: [
          v => !!v || 'akreditas is required' ,
          v => v.match("[a-zA-Z]") || 'akreditas berupa huruf',
          v => v.length == 1 || 'akreditas berupa satu huruf'
        ] 
      },
      nama:'nama',
      search:'',
      prodis:[],
      dialog: false,
      headers:[
        { text:'Nama', value:'nama' },
        { text:'Akreditas', value:'akreditas'},
        { text:'Aksi', value:'aksi'}
      ],
      editedIndex: -1,
      editedItem: {
        nama: '',
        akreditas:''
      },
      defaultItem: {
        nama: '',
        akreditas:''
      },
    }
  },
  computed:{
    formTitle(){
      return this.editedIndex == -1 ? 'New Item' : 'Edit Item';
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods:{
    close() {
      this.$refs.form.resetValidation();
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    
    save () {
        if (this.editedIndex > -1) {
          let uri = `http://localhost:3000/prodi/${this.editedItem.id}`;
          this.axios.put(uri, this.editedItem)
            .then((res) => {
              if(res.data.data[0]){
                Object.assign(this.prodis[this.editedIndex], this.editedItem);
                this.close()
              }else{
                console.log('error');
              }
            }).catch((err) => {
              console.log(err);
            });
        } else {
          let uri = 'http://localhost:3000/prodi';
          this.axios.post(uri, this.editedItem)
            .then((res) => {
              console.log(res);
              this.prodis.push(res.data.data);
              this.close()
            }).catch((err) => {
              console.log(err);
            });
        }
    },

    editItem (item) {
      // console.log(item);
      // this.editedIndex = 1;
      this.editedIndex = this.prodis.indexOf(item);
      this.editedItem = Object.assign({}, item);
      // console.log(this.editedItem);
      this.dialog = true;
    },

    deleteItem (item) {
      let del = confirm('Are you sure you want to delete this item?');
      if(del){
        let uri = `http://localhost:3000/prodi/${item.id}`;
        this.axios.delete(uri)
          .then((res) => {
            if(res.data.data){
              const index = this.prodis.indexOf(item)
              this.prodis.splice(index, 1)
            }else{
              console.log('error');
            }
          }).catch((err) => {
            console.log(err);
          });
      }
    }
  }
  
}
</script>