const Rider = require('../models/Rider');
const User = require('../models/User');
const { handleError } = require('../utils/errorHandler');

// Get all riders
exports.getAllRiders = async (req, res) => {
  try {
    const riders = await Rider.find()
      .populate('user', 'name email phone')
      .select('-documents');
    res.json(riders);
  } catch (error) {
    handleError(res, error);
  }
};

// Get rider by ID
exports.getRiderById = async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id)
      .populate('user', 'name email phone')
      .select('-documents');
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }
    res.json(rider);
  } catch (error) {
    handleError(res, error);
  }
};

// Get rider by user ID
exports.getRiderByUserId = async (req, res) => {
  try {
    const rider = await Rider.findOne({ user: req.user._id })
    .populate('user', 'name email phone')
    .select('-documents');
    if (!rider) {
      return res.status(404).json({ message: 'Rider profile not found' });
    }
    res.json(rider);
  } catch (error) {
    handleError(res, error);
  }
};

// Create new rider
exports.createRider = async (req, res) => {
  try {
    const { vehicleType, documents } = req.body;

    // Check if rider already exists for this user
    const existingRider = await Rider.findOne({ user: req.user._id });
    if (existingRider) {
      return res.status(400).json({ message: 'Rider profile already exists for this user' });
    }

    // Update user role to rider
    await User.findByIdAndUpdate(req.user._id, { role: 'rider' });

    const rider = new Rider({
      user: req.user._id,
      vehicleType,
      documents,
      isAvailable: true,
      status: 'active'
    });

    await rider.save();
    res.status(201).json(rider);
  } catch (error) {
    handleError(res, error);
  }
};

// Update rider status
exports.updateRiderStatus = async (req, res) => {
  try {
    // console.log(req.body);
    const { status, isAvailable } = req.body;
    const rider = await Rider.findOneAndUpdate({ user: req.user._id }, { status, isAvailable }, { new: true });
    
    // if (!rider) {
    //   return res.status(404).json({ message: 'Rider not found' });
    // }

    // if (status) rider.status = status;
    // if (typeof isAvailable === 'boolean') rider.isAvailable = isAvailable;

    // await rider.save();
    res.json(rider);
  } catch (error) {
    handleError(res, error);
  }
};

// Update rider location
exports.updateRiderLocation = async (req, res) => {
  try {
    // console.log(req.body);
    const { latitude, longitude } = req.body;
    const rider = await Rider.findOne({ user: req.user._id });
    
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    rider.currentLocation = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };

    await rider.save();
    res.json(rider);
  } catch (error) {
    handleError(res, error);
  }
};

// Update rider documents
exports.updateRiderDocuments = async (req, res) => {
  try {
    const { documents } = req.body;
    const rider = await Rider.findOne({ user: req.user._id });
    
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    rider.documents = documents;
    await rider.save();
    res.json(rider);
  } catch (error) {
    handleError(res, error);
  }
};

// Get nearby riders
exports.getNearbyRiders = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 5000 } = req.query; // maxDistance in meters

    const riders = await Rider.find({
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      isAvailable: true,
      status: 'active'
    })
    .populate('user', 'name phone')
    .select('currentLocation vehicleType rating');

    res.json(riders);
  } catch (error) {
    handleError(res, error);
  }
};

// Update rider rating
exports.updateRiderRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const rider = await Rider.findById(req.params.id);
    
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    // Calculate new average rating
    const newTotalDeliveries = rider.totalDeliveries + 1;
    const newRating = ((rider.rating * rider.totalDeliveries) + rating) / newTotalDeliveries;

    rider.rating = newRating;
    rider.totalDeliveries = newTotalDeliveries;

    await rider.save();
    res.json(rider);
  } catch (error) {
    handleError(res, error);
  }
}; 