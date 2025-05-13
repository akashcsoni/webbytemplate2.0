"use client";

import React from "react";

const ErrorPage = ({ error }) => {
    const errorMessage = error?.message || "Something went wrong.";
    const errorDetails = error?.response?.data;

    return (
        <div style={{ padding: "2rem", color: "red" }}>
            <h2>🚨 Site Error</h2>
            <p><strong>Message:</strong> {errorMessage}</p>

            {errorDetails && (
                <div style={{ marginTop: "1rem", backgroundColor: "#fdd", padding: "1rem", borderRadius: "8px" }}>
                    <h4>Error Details:</h4>
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                        {JSON.stringify(errorDetails, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default ErrorPage;
