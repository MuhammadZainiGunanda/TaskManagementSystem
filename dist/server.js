"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web_1 = require("./app/web");
web_1.webApplicaiton.listen(3000, () => {
    console.info("Server running on port 3000");
});
