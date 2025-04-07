import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }],

    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, default: 1 },
        countInStock: { type: Number, required: true },
      }
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
