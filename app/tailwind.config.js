module.exports = {
  mode: "jit",
  content: ["./src/**/*.js"],
  theme: {
    extend: {
      backgroundImage: {
        stripesImage: "linear-gradient(125deg, #4ba6ff 25%, #0560fd 25%, #0560fd 50%, #4ba6ff 50%, #4ba6ff 75%, #0560fd 75%, #0560fd 100%)",
      },
      boxShadow: {
        box: "0 0 1.25rem 0 #00000033",
        userCard: "0 0 32px 0 #D1D3D6",
        menuShadow: "0 0 18px 0 rgba(0, 0, 0, 0.12)",
        paymentCardShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
        toPayCardShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
        signUpCardShadow: "0px 0px 10px rgba(99, 105, 115, 0.08)",
        cummunityCard: "0px 0px 10px rgba(99, 105, 115, 0.14)",
        arrow: "0px 2px 10px rgba(99, 105, 115, 0.24)",
        btnsShadow: "0px 0px 22px rgba(99, 105, 115, 0.16)",
      },

      fontSize: {
        minOption: "10px", // 10px
        min: "0.687rem", // 11px
        med: "0.75rem", // 12px
        normal: "0.8125rem", // 13px
        big: "1.687rem", // 27px
        twenty: "20px",
      },
      colors: {
        "dull-black": "#212325", // heading text
        "light-grey": "#676D7C", // heading sub Title
        "chips-bg": "#0560fd33", // chips bg
        "chips-text": "#0560FD", //  chips text
        "shade-blue": "#0560FD", //skills category bg
        "dirty-grey": "#a0a6b199", // center border
        "half-white": "#F9FBFD", // inputs bg
        "half-grey": "#A0A6B1", // inputs text
        "shade-red": "#FD3131", // inputs Error label
        "shade-sky-blue": "#0069d9", // loading Button
        "lightShade-grey": "#EBF0F4", // jobCategory card border
        "light-white": "#FFFFFF", //boreders Inputs
        "dark-gray": "#BEC4CF", // button bg
        "dush-gray": "#E5EAEF", // progress bar bg
        "right-bg": "#EBF3FC",
        "gray-bord": "#D2D8E3", //gray Border
      },
      width: {
        eighty: "80%",
        ninety: "90%",
        sixtyFive: "65%",
      },
      borderRadius: {
        none: "0",
        xs: "2px",
        sm: "4px",
        md: "6px",
        large: "10px",
        full: "9999px",
      },
      height: {
        hund: "100px",
      },
      minHeight: {
        100: "100px",
        130: "130px",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
