import React from "react";
import Login from "./Login";
import Grid from "@mui/material/Grid";
import { Card } from "@mui/material";
import Register from "./Register";
import { Route, Routes } from "react-router-dom";

const Authentication = () => {
  return (
    <div>
      <Grid container>
        <Grid className="h-screen overflow-hidden" item xs={7}>
          {/* <img className='h-full w-full' src="https://cdn.pixabay.com/photo/2017/06/14/08/20/map-of-the-world-2401458_1280.jpg" alt="" /> */}
        </Grid>
        <Grid item xs={5}>
          <div className="px-20 flex flex-col justify-center h-full">
            <Card className="card p-8">
              <div className="flex flex-col items-center mb-5 space-y-1">
                <h1 className="logo text-center">Flavourflow</h1>
                <p className="text-center text-sm w-[70&]">
                  Connecting with others,sharing your tastiest secrets with
                  others
                </p>
              </div>

<Routes>
  <Route path="/" element={<Login/>}></Route>
  <Route path="/login" element={<Login/>}></Route>
  <Route path="/register" element={<Register/>}></Route>
</Routes>
                        
            </Card>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Authentication;
