const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid Email address"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 charcters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return validator.isMobilePhone(v, "any");
        },
        message: (props) => `${props.value} is not a valid phone number`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be atleast 8 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Indexing for faster lookup
// userSchema.index({email:1});
// userSchema.index({username:1});

// Password hassing before save
userSchema.pre("save",async function(next){
  if (!this.isModified("password")) return next();
  this.password= await bcrypt.hash(this.password,12);
  next();
});

// Instance method to check password 
userSchema.methods.comparePassword=async function (candidatePassowrd){
  return await bcrypt.compare(candidatePassowrd,this.passowrd);
}


const User = mongoose.model("User", userSchema);
module.exports = User;
