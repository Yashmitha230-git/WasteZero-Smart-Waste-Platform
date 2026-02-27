import Stats from "../model/stats.js";
import Pickup from "../model/pickup.js";
import Opportunity from "../model/opportunity.js";
import ActivityLog from "../model/activitylog.js";

// ensure stats document exists
const ensureStats = async () => {
  let stats = await Stats.findOne();
  if (!stats) {
    stats = await Stats.create({
      totalPickups: 0,
      recycledItems: 0,
      co2Saved: 0,
      volunteerHours: 0
    });
  }
  return stats;
};

const calculateCO2 = (type, qty) => {
 if (!type || !qty) return 0;

 const factors = {
  plastic: 6,
  paper: 3,
  metal: 9,
  glass: 1
 };

 return (factors[type.toLowerCase()] || 0) * qty;
};


export const createPickup = async (req,res)=>{
 try{

  const pickup = await Pickup.create(req.body);

  res.status(201).json({
   success:true,
   data:pickup
  });

 }catch(err){
  res.status(500).json({msg:err.message});
 }
};


export const completePickup = async (req,res)=>{
 try{

  const pickup = await Pickup.findById(req.params.id);

  if(!pickup)
   return res.status(404).json({msg:"Pickup not found"});

  pickup.status="Completed";
  await pickup.save();

  res.json({
   message:"Pickup Completed",
   data:pickup
  });

 }catch(err){
  res.status(500).json({msg:err.message});
 }
};


export const getPickups = async (req,res)=>{
  try{
    console.log("GET pickups hit");
    const pickups = await Pickup.find();
    res.json(pickups);
  }catch(err){
    console.log(err);
    res.status(500).json({error:err.message});
  }
};



// add volunteer hours
export const createOpportunity = async (req, res) => {
  try {


    const { title, description, location, date, duration, status } = req.body;

    // image file (multer upload)
    const image = req.file ? req.file.filename : null;


    const newOpportunity = await Opportunity.create({
      title,
      description,
      location,
      date,
      duration,
      status,
      image 
    });

    // log activity
    await ActivityLog.create({
      user: "Admin",
      action: "Created Opportunity",
      value: 1
    });
    console.log(req.body);
    console.log(req.file);

    res.status(201).json(newOpportunity);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      duration: req.body.duration,
      status: req.body.status,
    };

    // If image uploaded
    if (req.file) {
      updatedData.image = req.file.path;
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedOpportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.status(200).json(updatedOpportunity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};



// get dashboard data
export const getDashboardData = async (req, res) => {
  try {
    await ensureStats();

    const stats = await Stats.findOne();
    const pickups = await Pickup.find().sort({ createdAt: -1 }).limit(5);

    const breakdown = [
      { type: "Plastic", percent: 40 },
      { type: "Paper", percent: 25 },
      { type: "Metal", percent: 20 },
      { type: "Glass", percent: 15 }
    ];

    res.json({
      stats,
      pickups,
      breakdown
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// add recycled items manually
export const addRecycledItems = async (req, res) => {
  try {
    await ensureStats();

    const { items } = req.body;

    if (!items || isNaN(items)) {
      return res.status(400).json({ msg: "Valid items value required" });
    }

    await Stats.updateOne({}, { $inc: { recycledItems: items } });

    await ActivityLog.create({
      user: "User",
      action: "Added Recycled Items",
      value: items
    });

    res.json({ message: "Recycled items added successfully" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

