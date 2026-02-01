"use client";
/* First make sure that you have installed the package */

/* If you are using yarn */
// yarn add @calcom/embed-react

/* If you are using npm */
// npm install @calcom/embed-react
  
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
export default function MyApp() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"30min"});
      cal("ui", {"cssVarsPerTheme":{"light":{"cal-brand":"#00adef"},"dark":{"cal-brand":"#00EFB9"}},"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, [])
  return <div className="flex w-full h-screen flex-col justify-center items-center"> 
  {/* <h1 className="font-bold">Schedule Your Appointment</h1> */}
  <Cal namespace="30min" 
  // title="Schedule Your Appointment"
    calLink="circle-of-three-technologies-obtkkx/30min"
    style={{width:"100%",height:"100%",overflow:"scroll"}}
    config={{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}}    
  />
  
  </div>
};
  