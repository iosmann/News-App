var Schema = mongoose.Schema;

var SaveSchema = new Schema({
    
    title: {
      type: String,
      required: true
    },
    
    summary: String,
    
    link: {
      type: String,
      required: true
    },
    note: {
      type: Schema.Types.ObjectId,
      ref: "Notes"
    }
  });
  
  // This creates our model from the above schema, using mongoose's model method
  var Save = mongoose.model("Save", SaveSchema);
  
  // Export the Article model
  module.exports = Save;
