const express =  require("express");
const app = express();
const mongoose = require("mongoose");
// // const ejs = require("ejs");
const Listing =require("./models/listing.js");
const path = require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsyn = require("./utils/wrapAsyn.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js")

const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";



main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    }); 

async function main() {
    await mongoose.connect(Mongo_url);
}


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);


app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.send("Hi i am root");
});


// //Index route
app.get("/listings", async(req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings });
})

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Read route
app.get("/listings/:id", async(req,res) => {
    try{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/show.ejs",{listing});
    }catch(err){
        res.status(400).send("Invalid ID");
    }
    
});

 

//Create route
app.post("/listings", wrapAsyn(async(req, res) => {
     
        if (!req.body.listing) {
        return res.status(400).send("Send valid listing data");
        }
        // let listing = req.body.listing;
        const newListing = new Listing(req.body.listing);
         
        await newListing.save();
        res.redirect("/listings");
            
     
    
}));

// Edit route
// app.get("/listing/:id/edit", async(req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id);
//     res.redirect("listings/edit.ejs", {listing});
// })

// Edit route
// app.get("/listings/:id/edit", async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         return res.status(404).send("Listing not found");
//     }
//     res.render("listings/edit.ejs", { listing });
// });

// Edit route
app.get("/listings/:id/edit", async (req, res) => {
    try{
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
    
        res.render("listings/edit.ejs", { listing });
    }catch(error)
    {
        res.status(400).send("Invalid ID");
    }
    
     
});

// Update route
app.put("/listings/:id", async (req, res) => {
    try{
        let { id } = req.params;
        const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, 
            {   
                //  new: true,
                returnDocument: "after",
                runValidators: true,
            });
        if (!updatedListing) {
            return res.status(404).send("Listing not found");
        }
        res.redirect(`/listings/${id}`);
    }catch(err){
        res.status(400).send("Invalid ID");
    }
    
});

//Delete route
app.delete("/listings/:id", async(req, res) => {
    try{
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);

        // console.log("deletedListing");
        if (!deletedListing) {
        return res.status(404).send("Listing not found");
        }

        res.redirect("/listings");
    }catch(err){
        res.status(400).send("Invalid ID");
    }
    
});

// app.get("/testlisting", (req,res) => {});

// app.get("/testlisting", async(req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach" ,
//         price: 1200,
//         location: "Calangute,Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");

// });


app.use((req, res, next) => {
    next(new ExpressError(404, "Page NOT FOUND!"));
});
 
app.use((err,req,res,next) => {
    let {statusCode, message} = err;
    res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});