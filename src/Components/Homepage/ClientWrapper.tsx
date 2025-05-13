"use client"

import React from "react";
import { useSmoothScroll } from "./SmoothScrool";

const ClientWrapper = ({children}:{children:React.ReactNode}) => {
useSmoothScroll()
return<>
{children}
</>
}
export default ClientWrapper;