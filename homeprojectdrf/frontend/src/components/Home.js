import React from "react";
import ShowTool from "./Tool/ShowTool";
import { Routes, Route } from "react-router-dom";
import Tool from "./Tool/Tool";
import EditTool from "./Tool/EditTool";
import CreateTool from "./Tool/CreateTool";



export default function Home() {

    return (
        <section>
                <Routes>
                    <Route path="/api/tools/create" element={<CreateTool />} />
                    <Route path="/api/tools/:id" element={<EditTool />} />
                    <Route path="/" element={<ShowTool />} />
                    <Route path="/api/tools/show/:id" element={<Tool />} />
                </Routes>

        </section>
    )
}

