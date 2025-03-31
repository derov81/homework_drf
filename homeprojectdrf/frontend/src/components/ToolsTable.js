import React from "react";

const ToolsTable = ({ tools, selectedOperation }) => (
  <div>
    <h2>Tools</h2>
    {selectedOperation ? (
      <table border="1" cellPadding="10" style={{ width: "300px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Article</th>
            <th>Type tool</th>
            <th>Work tool</th>
            <th>Length tool</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => (
            <tr key={tool.id}>
              <td>{tool.id}</td>
              <td>{tool.brand_tool}</td>
              <td>{tool.article}</td>
              <td>{tool.type_tool}</td>
              <td>{tool.working_length_tool}</td>
              <td>{tool.length_tool}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>Please select an operation to view its tools.</p>
    )}
  </div>
);

export default ToolsTable;