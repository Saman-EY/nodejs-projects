const { default: axios } = require("axios");
const { config } = require("dotenv");
const createHttpError = require("http-errors");
config();

async function zarinpalRequestService(amount, user, description = "خرید محصول") {
  try {
    const result = await axios.post(
      process.env.ZARINPAL_REQUEST_URL,
      {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        callback_url: process.env.ZARINPAL_CALLBACK_URL,
        amount: amount * 10, // Convert TOMAN to RIAL
        description,
        metadata: {
          email: "lorem@mail.com",
          mobile: user?.mobile,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // console.log("✅", result.data);

    if (result?.data.authority) {
      return {
        authority: result?.data?.authority,
        payment_url: `${process.env.ZARINPAL_GATEWAY_URL}/${result?.data.authority}`,
      };
    }

    throw createHttpError(400, "zarinpal service not available");
  } catch (error) {
    console.log("❌", error);
    throw error;
  }
}

async function zarinpalVerifyService(amount, authority) {
  try {
    const result = await axios.post(
      process.env.ZARINPAL_VERIFY_URL,
      {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        authority,
        amount: amount * 10, // Convert TOMAN to RIAL
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // console.log("✅", result.data);

    if (result?.data?.code === 100) {
      return {};
    } else if (result?.data?.code === 101) {
      throw createHttpError(409, "Already Verified payment"); // conflict
    }

    throw createHttpError(400, "something went wrong");
  } catch (error) {
    console.log("❌", error);
    throw error;
  }
}

module.exports = {
  zarinpalRequestService,
  zarinpalVerifyService,
};
