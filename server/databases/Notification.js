//Moongose ~ MongoDB
const mongoose=require('mongoose')
const NotificationSchema=new mongoose.Schema({
   userId : {
      type : mongoose.Schema.Types.ObjectId ,
      ref : 'user'
   },
   message:String,
   timestamp: {
      type : Date ,
      expires : 14400
   }
},{ versionKey: false })


// '{ versionKey: false }' -> elimina adaugarea cheii __v in baza de date la viitoare insertii
//(cheie v__ reprezinta versiunea curenta a documentului , ce se incrementeaza la eventuale modificari)
//modelul definit 'stock' va cauta o colectie la plural cu litere mici -> 'stocks'
const Notification=mongoose.model('notification',NotificationSchema)

module.exports=Notification