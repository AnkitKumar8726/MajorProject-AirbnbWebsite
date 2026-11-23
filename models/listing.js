
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default:
                "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        },
    },

    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;







        // type: String,
        // default:
            
        // set: (v) => 
        //     v == "" 
        //         ? "file:///Users/ankitkumar/Downloads/closeup-palm-tree-leaves-surrounded-by-sea-mountains-sunlight-blue-sky.jpg"
        //         :v,
        
    // },
 

// filename: {
        //     type: String,
        //     default: "listingimage"
        // },
        // url: {
        //     type: String,
        //     default: "https://www.freepik.com/free-photo/beautiful_1030690.htm#fromView=keyword&page=1&position=0&uuid=1f51f446-6aa9-44ef-a08e-1ac3d80f28ba&query=Beach"
        // }